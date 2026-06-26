import oci
import json, sys, time, random

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

print(f"IMAGE: {img.display_name}")

from oci.core.models import (
    LaunchInstanceDetails, CreateVnicDetails,
    LaunchInstanceShapeConfigDetails, InstanceSourceViaImageDetails
)

# COBA 3 VARIASI SPEK
configs = [
    ("2 OCPU, 12GB RAM, 100GB boot", 2, 12, 100),
    ("3 OCPU, 18GB RAM, 150GB boot", 3, 18, 150),
    ("4 OCPU, 24GB RAM, 200GB boot", 4, 24, 200),
]

for label, ocpus, mem, boot_size in configs:
    print(f"\n=== COBA: {label} ===")
    instance_details = LaunchInstanceDetails(
        availability_domain=env["OCT_FREE_AD"],
        compartment_id=config["tenancy"],
        display_name=f"sipanda-arm-{ocpus}c-{mem}g",
        image_id=img.id,
        shape="VM.Standard.A1.Flex",
        subnet_id=env["OCI_SUBNET_ID"],
        metadata={"ssh_authorized_keys": ssh_key},
        create_vnic_details=CreateVnicDetails(assign_public_ip=True),
        shape_config=LaunchInstanceShapeConfigDetails(ocpus=ocpus, memory_in_gbs=mem),
        source_details=InstanceSourceViaImageDetails(
            image_id=img.id,
            boot_volume_size_in_gbs=boot_size
        )
    )
    try:
        resp = compute.launch_instance(instance_details)
        inst = resp.data
        print(f"✅ CREATED! ID: {inst.id}")
        with open(f"{BASE}/INSTANCE_CREATED", "w") as f:
            f.write(json.dumps({
                "id": inst.id,
                "display_name": inst.display_name,
                "state": inst.lifecycle_state,
                "spec": label,
                "region": config["region"],
            }, indent=2))
        print(f"✅ Instance info saved to INSTANCE_CREATED")
        sys.exit(0)
    except oci.exceptions.ServiceError as e:
        print(f"❌ {e.status} {e.code}: {str(e.message)[:150]}")
        if "LimitExceeded" in e.code or "OutOfCapacity" in e.code:
            continue
        elif "TooManyRequests" in e.code:
            print("Rate limited, tunggu 180s...")
            time.sleep(180)
        else:
            print("Error lain, lanjut...")

print("\n❌ Semua variasi GAGAL (LimitExceeded)")
