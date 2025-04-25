# cmd: pytest test/unit

import pytest
from src.util.helpers import hasAttribute

# To avoid reduntant code
@pytest.fixture
def obj():
    return {'name': 'Jane'}

# Unit testing (Option 1)
def test_hasAttribute_true(obj):
    result = hasAttribute(obj, 'name')
    assert result == True

def test_hasAttribute_false(obj):
    result = hasAttribute(obj, 'email')
    assert result == False

def test_hasAttribute_None():
    obj = None
    result = hasAttribute(obj, 'name')
    assert result == False

