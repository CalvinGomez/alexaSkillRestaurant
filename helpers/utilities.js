function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function isDietTypePresent(types, diet_type) {
    var flag = 0
    for (var i = 0; i < types.length; i++) {
        if (diet_type == types[i].type) {
            flag = 1
            break
        }
    }
    if (flag == 1) {
        return true
    }
    else {
        return false
    }
}

exports.isEmptyObject = isEmptyObject;
exports.isDietTypePresent = isDietTypePresent;