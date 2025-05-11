#!/bin/bash

echo "Running MongoDB cleanup inside Docker container..."

docker-compose exec -T mongodb mongosh -u root -p root --authenticationDatabase admin <<'EOF'
use edutask

const collections = ["task", "video", "todo", "user"];

collections.forEach(col => {
    const result = db[col].deleteMany({});
    const remaining = db[col].countDocuments();
    print(`Cleared '${col}': Deleted ${result.deletedCount}, Remaining ${remaining}`);
});
EOF

echo "✅ MongoDB collections cleanup and verification done."
