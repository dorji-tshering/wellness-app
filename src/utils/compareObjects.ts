// recursive object comparison
export const isEqualObject = (obj1: any, obj2: any) => {
    const primitive = ['string','number','boolean','undefined'];
    const typeA = typeof obj1;
    const typeB = typeof obj2;
    if (typeA!==typeB) {
        return false
    };
    if (primitive.includes(typeA)) {
        return obj1 === obj2
    }
    //if got here - objects
    if (obj1.length !== obj2.length) {
        return false
    }
    //check if arrays
    const isArrayA = Array.isArray(obj1);
    const isArrayB = Array.isArray(obj2);
    if (isArrayA !== isArrayB) {
        return false
    }
    if (isArrayA) { //arrays
        for (let i = 0; i < obj1.length; i++) {
            if (!isEqualObject(obj1[i],obj2[i])) {
                return false
            }
        }
    } else { //objects
        //compare object keys
        if (!isEqualObject(Object.keys(obj1).sort(),Object.keys(obj2).sort())) {
            return false
        }
        //compare object values
        let result = true;
        Object.keys(obj1).forEach((key) => {
            if (!isEqualObject(obj1[key],obj2[key])) {
                result = false
            }
        })
        return result
    }
    return true
}

