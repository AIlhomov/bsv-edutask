import pytest
from unittest.mock import MagicMock
from src.controllers.usercontroller import UserController
from src.util.dao import DAO

@pytest.fixture
def mock_dao():
    """Fixture to mock the DAO object."""
    return MagicMock(spec=DAO)

@pytest.fixture
def user_controller(mock_dao):
    """Fixture to create a UserController instance with a mocked DAO."""
    return UserController(dao=mock_dao)

@pytest.mark.demo
def test_valid_email_single_user(user_controller, mock_dao):
    """Test with a valid email that matches exactly one user."""
    mock_dao.find.return_value = [{"_id": "123", "email": "test@example.com"}]
    user = user_controller.get_user_by_email("test@example.com")
    assert user["_id"] == "123"
    assert user["email"] == "test@example.com"

def test_valid_email_multiple_users(user_controller, mock_dao, capsys):
    """Test with a valid email that matches multiple users."""
    mock_dao.find.return_value = [
        {"_id": "123", "email": "test@example.com"},
        {"_id": "456", "email": "test@example.com"}
    ]
    user = user_controller.get_user_by_email("test@example.com")
    captured = capsys.readouterr()
    assert "Error: more than one user found with mail test@example.com" in captured.out
    assert user["_id"] == "123"

def test_invalid_email_format(user_controller):
    """Test with an invalid email format."""
    with pytest.raises(ValueError, match="Error: invalid email address"):
        user_controller.get_user_by_email("invalid-email")

def test_non_existent_email(user_controller, mock_dao):
    """Test with a valid email that does not exist in the database."""
    mock_dao.find.return_value = []
    user = user_controller.get_user_by_email("nonexistent@example.com")
    assert user is None

def test_database_error(user_controller, mock_dao):
    """Simulate a database error during the query."""
    mock_dao.find.side_effect = Exception("Database error")
    with pytest.raises(Exception, match="Database error"):
        user_controller.get_user_by_email("test@example.com")

def test_case_insensitive_email(user_controller, mock_dao):
    """Test with an email that matches a user in the database but with different casing."""
    mock_dao.find.return_value = [{"_id": "123", "email": "Test@Example.com"}]
    user = user_controller.get_user_by_email("test@example.com")
    assert user["_id"] == "123"

def test_email_with_whitespace(user_controller, mock_dao):
    """Test with an email that contains leading or trailing whitespace."""
    mock_dao.find.return_value = [{"_id": "123", "email": "test@example.com"}]
    user = user_controller.get_user_by_email("  test@example.com  ")
    assert user["_id"] == "123"