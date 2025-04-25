import pytest
import unittest.mock as mock

from src.util.helpers import ValidationHelper, hasAttribute

@pytest.mark.demo
def test_validationAge_1():
    mockedusercontroller = mock.MagicMock()
    mockedusercontroller.get.return_value = {'age': -1}
    sut = ValidationHelper(usercontroller=mockedusercontroller)
    validationresult = sut.validateAge(userid=None)
    assert validationresult == 'invalid'
    
@pytest.mark.demo
def test_validationAge_2():
    mockedusercontroller = mock.MagicMock()
    mockedusercontroller.get.return_value = {'age': 0}
    sut = ValidationHelper(usercontroller=mockedusercontroller)
    validationresult = sut.validateAge(userid=None)
    assert validationresult == 'underaged'

@pytest.mark.demo
def test_validationAge_3():
    mockedusercontroller = mock.MagicMock()
    mockedusercontroller.get.return_value = {'age': 1}
    sut = ValidationHelper(usercontroller=mockedusercontroller)
    validationresult = sut.validateAge(userid=None)
    assert validationresult == 'underaged'

@pytest.mark.demo
def test_validationAge_4():
    mockedusercontroller = mock.MagicMock()
    mockedusercontroller.get.return_value = {'age': 120}
    sut = ValidationHelper(usercontroller=mockedusercontroller)
    validationresult = sut.validateAge(userid=None)
    assert validationresult == 'valid'
def test_validationAge_5():
    mockedusercontroller = mock.MagicMock()
    mockedusercontroller.get.return_value = {'age': 18}
    sut = ValidationHelper(usercontroller=mockedusercontroller)
    validationresult = sut.validateAge(userid=None)
    assert validationresult == 'valid'

# We can alternatively use loops to reduce code duplication
# but this is not recommended because we wouldnt know which test failed