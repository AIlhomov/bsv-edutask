import pytest
from src.util.dao import DAO
from pymongo import MongoClient

@pytest.fixture(scope="module")
def test_dao():
    # Setup test database
    client = MongoClient('mongodb://root:root@localhost:27017/admin')
    db = client['test_edutask']
    collection = db['test_users']
    
    # Define validators (example schema)
    db.command({
        'collMod': 'test_users',
        'validator': {
            '$jsonSchema': {
                'bsonType': 'object',
                'required': ['name', 'email'],
                'properties': {
                    'name': {'bsonType': 'string'},
                    'email': {'bsonType': 'string', 'pattern': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'}
                }
            }
        }
    })
    
    yield DAO(collection_name='test_users')
    
    # Teardown: Drop test collection
    db.drop_collection('test_users')