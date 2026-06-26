# Auto-create ARM instance via OCI API with retry
import sys, os, json, time, subprocess, random

PYTHON = '/usr/bin/python3.12'
BASE = '/home/pondokinformatika/oracle-freetier-instance-creation'

def launch():
    """Launch ARM instance with 200GB boot volume"""
    code = '''
import oci, json, sys

BASE = "/home/pondokinformatika/oracle-freetier-instance-creation"
config = oci.config.from_file(f"{BASE}/oci_config")

env = {}
with open(f"{BASE}/oci.env") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k] = v.strip('"').strip("'")

with open(env["SSH_AUTHORIZED_KEYS_FILE"]) as f:
    ssh_key = f.read().strip()

compute = oci.core.ComputeClient(config)

images = compute.list_images(config["tenancy"], shape="VM.Standard.A1.Flex").data
img = None
for im in images:
    if "Canonical-Ubuntu-22.04-aarch64" in im.display_name and "Minimal" not in im.display_name:
        img = im
        break
if not img:
    for im in images:
        if "Canonical-Ubuntu" in im.display_name:
            img = im
            break

print(f"IMAGE:{img.display_name}")

from oci.core.models import (
    LaunchInstanceDetails, CreateVnicDetails,
    LaunchInstanceShapeConfigDetails, InstanceSourceViaImageDetails
)

instance_details = LaunchInstanceDetails(
    availability_domain=env["OCT_FREE_AD"],
    compartment_id=config["tenancy"],
    display_name=env.get("DISPLAY_NAME", "sipanda-arm-instance"),
    image_id=img.id,
    shape=env.get("OCI_COMPUTE_SHAPE", "VM.Standard.A1.Flex"),
    subnet_id=env["OCI_SUBNET_ID"],
    metadata={"ssh_authorized_keys": ssh_key},
    create_vnic_details=CreateVnicDetails(assign_public_ip=True),
    shape_config=LaunchInstanceShapeConfigDetails(ocpus=4, memory_in_gbs=24),
    source_details=InstanceSourceViaImageDetails(
        image_id=img.id,
        boot_volume_size_in_gbs=200
    )
)

try:
    resp = compute.launch_instance(instance_details)
    inst = resp.data
    print(f"CREATED:{inst.id}")
    with open(f"{BASE}/INSTANCE_CREATED", "w") as f:
        f.write(json.dumps({
            "id": inst.id,
            "display_name": inst.display_name,
            "state": inst.lifecycle_state,
            "time_created": str(inst.time_created),
            "region": config["region"],
        }, indent=2))
    print("DETAILS_SAVED")
except oci.exceptions.ServiceError as e:
    # Print structured error: STATUS|CODE|MESSAGE
    msg = str(e.message).replace(chr(92)+'n', ' ')[:200]
    print(f"ERROR:{e.status}|{e.code}|{msg}")
    sys.exit(1)
'''
    result = subprocess.run([PYTHON, '-c', code], capture_output=True, text=True, timeout=30)
    return result

def get_error_type(combined):
    """Determine error type from combined stdout+stderr"""
    if 'CREATED:' in combined:
        return 'SUCCESS', ''
    if 'Out of host capacity' in combined or 'Out of capacity' in combined:
        return 'CAPACITY', ''
    if 'TooManyRequests' in combined or '429' in combined:
        return 'RATE_LIMIT', ''
    if 'LimitExceeded' in combined:
        return 'LIMIT', ''
    if 'ERROR:' in combined:
        # Parse structured error
        for line in combined.split('\n'):
            if line.startswith('ERROR:'):
                parts = line.split('|', 2)
                if len(parts) >= 3:
                    return f'ERR_{parts[1]}', parts[2]
    return 'UNKNOWN', combined[:200]

# === MAIN LOOP ===
print("=== ARM INSTANCE AUTO-CREATE ===")
print(f"Start: {time.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Shape: VM.Standard.A1.Flex (4 OCPU, 24GB RAM, 200GB boot)")
print(f"Region: ap-batam-1, AD: JDgh:AP-BATAM-1-AD-1")
print(f"Image: Canonical-Ubuntu-22.04 aarch64")
print("Retry every 120s if OutOfHostCapacity...\n")

attempt = 0
wait = 90
while True:
    attempt += 1
    ts = time.strftime('%H:%M:%S')
    print(f"[{ts}] Attempt #{attempt}...", end=' ', flush=True)
    
    result = launch()
    combined = result.stdout + '\n' + result.stderr
    err_type, err_detail = get_error_type(combined)
    
    # Extract image name
    img_name = ''
    for line in result.stdout.split('\n'):
        if line.startswith('IMAGE:'):
            img_name = line.split(':', 1)[1][:35]
            break
    if img_name:
        print(f'[{img_name}]', end=' ', flush=True)
    
    if err_type == 'SUCCESS':
        for line in result.stdout.split('\n'):
            if line.startswith('CREATED:'):
                inst_id = line.split(':', 1)[1]
                print(f"OK! ID: {inst_id}")
                with open(f'{BASE}/RETRY_DONE', 'w') as f:
                    f.write(f'Attempt: {attempt}\nCreated: {ts}\n')
                print("Saved to INSTANCE_CREATED")
                sys.exit(0)
    
    elif err_type == 'CAPACITY':
        print('kapasitas penuh, retry...', flush=True)
        wait = 90 + random.randint(0, 60)
    
    elif err_type == 'RATE_LIMIT':
        print('rate limit, tunggu 180s...', flush=True)
        wait = 180
    
    elif err_type == 'LIMIT':
        print(f'LIMIT ERROR: {err_detail[:80]}')
        print('STOP - kuota mungkin habis')
        sys.exit(1)
    
    elif err_type.startswith('ERR_'):
        status = err_type.split('_')[1]
        if status in ('400', '500'):
            print(f'{status}: {err_detail[:60]}... retry', flush=True)
            wait = 120 + random.randint(0, 60)
        else:
            print(f'{status}: {err_detail[:80]}')
            print('STOP')
            sys.exit(1)
    else:
        print(f'UNKNOWN: {err_detail[:80]}')
        wait = 120
    
    print(f'  next in {wait}s...', flush=True)
    time.sleep(wait)
