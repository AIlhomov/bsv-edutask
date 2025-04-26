import pytest
from pymongo.errors import WriteError
from src.util.dao import DAO

def test_create_valid_data(dao):
    data = {
        "firstName": "Alice",
        "lastName": "Smith",
        "email": "alice@example.com"
    }
    result = dao.create(data)
    assert result is not None

def test_create_missing_required_field(dao):
    data = {"email": "bob@example.com"}  # Missing firstName and lastName
    with pytest.raises(WriteError):
        dao.create(data)

def test_create_invalid_data_type(dao):
    data = {
        "firstName": "Charlie",
        "lastName": "Brown",
        "email": 12345  # Invalid email type
    }
    with pytest.raises(WriteError):
        dao.create(data)

def test_create_duplicate_unique_field(dao):
    data = {
        "firstName": "Dave",
        "lastName": "Johnson",
        "email": "dave@example.com"  # Unique field
    }
    dao.create(data)
    with pytest.raises(WriteError):
        dao.create(data)  # Duplicate email