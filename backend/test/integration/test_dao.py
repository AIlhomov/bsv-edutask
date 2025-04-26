import pytest
from pymongo.errors import DuplicateKeyError, WriteError
from src.util.dao import DAO

@pytest.fixture
def test_dao():
    # Setup: create a DAO connected to a *test* database
    dao = DAO(collection_name='test_users')
    yield dao
    # Teardown: clean up the database after test
    dao.collection.delete_many({})

class TestDAOCreate:

    def test_create_valid(self, test_dao):
        valid_data = {'name': 'Alice', 'email': 'alice@example.com'}
        result = test_dao.create(valid_data)
        assert result.inserted_id is not None  # inserted_id is typical for successful insert in MongoDB

    def test_create_missing_required_field(self, test_dao):
        invalid_data = {'email': 'bob@example.com'}  # Missing 'name'
        with pytest.raises(WriteError):
            test_dao.create(invalid_data)

    def test_create_invalid_email_format(self, test_dao):
        invalid_data = {'name': 'Charlie', 'email': 'invalid-email'}
        with pytest.raises(WriteError):
            test_dao.create(invalid_data)
