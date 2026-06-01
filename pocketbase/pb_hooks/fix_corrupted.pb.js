routerAdd("GET", "/api/fix-ids", (c) => {
    const result = { deleted: 0, duplicated: 0, errors: [] };
    try {
        const records = $app.dao().findRecordsByExpr("news", $dbx.exp("1=1"));
        const validIdRegex = /^[a-z0-9]{15}$/i;
        
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const id = record.getId();
            
            if (!validIdRegex.test(id)) {
                const title = record.getString("title");
                
                try {
                    const existing = $app.dao().findRecordsByExpr("news", $dbx.exp("title={:title}", { title: title }));
                    let hasValid = false;
                    for (let j = 0; j < existing.length; j++) {
                        if (validIdRegex.test(existing[j].getId()) && existing[j].getId() !== id) {
                            hasValid = true;
                            break;
                        }
                    }
                    
                    if (hasValid) {
                        $app.dao().deleteRecord(record);
                        result.deleted++;
                    } else {
                        const collection = $app.dao().findCollectionByNameOrId("news");
                        const newRecord = new Record(collection);
                        
                        newRecord.set("title", record.getString("title"));
                        newRecord.set("content", record.getString("content"));
                        newRecord.set("category", record.getString("category"));
                        newRecord.set("imageUrl", record.getString("imageUrl"));
                        newRecord.set("isTop", record.getBool("isTop"));
                        
                        $app.dao().saveRecord(newRecord);
                        $app.dao().deleteRecord(record);
                        result.duplicated++;
                    }
                } catch(e) {
                   result.errors.push("Failed for " + title + ": " + e);
                }
            }
        }
    } catch (e) {
        result.errors.push(e.toString());
    }
    return c.json(200, result);
});
