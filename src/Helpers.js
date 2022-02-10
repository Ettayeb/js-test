const Helpers = {};

/**
 * manipulatorExist : this function is used to indicate if we are going to have a manipulator in our list generated or not.
 * 
 */
Helpers.manipulatorExist = () => Math.random() > 0.5;

/**
 * getFixedManipulator : this function is used to fix the value of the manipulator if it exists 
 * 1 >= manipulator >= n
 * it takes an array containing numbers from 1 to n as parameter
 */

Helpers.getFixedManipulator = (arrayOfN) => {

    const manipulatorExist = Helpers.manipulatorExist();
    if (manipulatorExist) {
        return arrayOfN[Math.floor(Math.random() * arrayOfN.length)];
    } else {
        return;
    }


}

/**
 * generateList : this function is used to generate the tust list depending on the existance of the manipulator 
 * it takes an array containing numbers from 1 to n as parameter in the side of the manipulator if it exists
 */

Helpers.generateList = (arrayOfN, manipulator) => {
    let couples;
    if (manipulator) {
        const index = arrayOfN.indexOf(manipulator);
        const arrayNoMan = [...arrayOfN];
        arrayNoMan.splice(index, 1);
        couples = arrayNoMan.flatMap(
            (v, i) => {
                return arrayOfN.reduce(
                    (acc, w) => {
                        if (v !== w) acc.push([v, w]);
                        return acc;
                    }, []);
            }
        )

    } else {

        couples = arrayOfN.flatMap(
            (v, i) => {
                return arrayOfN.reduce(
                    (acc, w) => {
                        if (v !== w) acc.push([v, w]);
                        return acc;
                    }, []);
            }
        )
    }

    return couples;
}

/**
 * createDataTree : this function is used to create a 1 level tree for 1 person represented by the parameter "root" 
 * arrayOfN: Array containing numbers from 1 to n.
 * dataset: Our generated list converted into a list of objects.
 * root: the root of the tree that we need to generate.
 */

Helpers.createDataTree = (arrayOfN, dataset, root) => {

    const hashTable = Object.create(null);
    arrayOfN.forEach(aData => hashTable[aData] = {
        name: aData,
        children: []
    });

    const dataTree = [];
    dataset.forEach((aData) => {
        if (aData.name === root) {
            hashTable[root]?.children.push(hashTable[aData.id])
        }
    })

    dataTree.push(hashTable[root])
    return {
        root: root,
        dataTree: dataTree[0]
    };
}

/**
 * convertDataTreeToObjectList : this function takes an array of arrays and convert it into an array of objects.
 */

Helpers.convertDataTreeToObjectList = (list) => {
    return list.map(e => ({
        id: e[0],
        name: e[1]
    }))
}
/**
 * findManipulator : this is a recursive function that it will return the object representing the manipulator and his tree
 * if it exists.
 * arrayOfN: Array containing numbers from 1 to n.
 * dataset: Our generated list converted into a list of objects.
 * n: the number of persons.
 * oldManipulator: the object maybe holding the real manipulator
 * index: the person used on the next iteration
 * changesCounter: a counter of how much "newManipulator" has changed
 */
Helpers.findManipulator = (arrayOfN, listOfObjects, n, oldManipulator, index, changesCounter) => {
    /**
     * If person number 1 is trusted by all the rest of the persons then he can be the manipulator or there is no manipulator,
     * also if there is 1 person not trusting the person number 1, then that person should be the manipulator.
     * ( depending on your answer to my questions)
     */

    let newManipulator = Helpers.createDataTree(arrayOfN, listOfObjects, index);
    let trustingAnother = false;

    do {
        index++;
        trustingAnother = newManipulator?.dataTree?.children?.findIndex(x => x.name === index) !== -1;
    } while (trustingAnother && index <= n)

    if (oldManipulator?.root !== newManipulator.root) {
        changesCounter++;
    }
    if (index <= n && changesCounter <= 2) {
        return Helpers.findManipulator(arrayOfN, listOfObjects, n, newManipulator, index, changesCounter);
    } else if (changesCounter === 2 && index - 1 === n) {

        return newManipulator;
    } else if (changesCounter === 1 && index - 1 === n) {

        let test = Helpers.createDataTree(arrayOfN, listOfObjects, index - 1);
        if (test?.dataTree?.children?.findIndex(x => x.name === 1) === -1) {

            return newManipulator;

        } else {
            return -1;
        }
    } else {
        return -1;
    }

}

/**
 * getManipulator : this function used to trigger the findManipulator function with the initial required data.
 */

Helpers.getManipulator = (arrayOfN, listOfLists, n) => {

    let listOfObjects = Helpers.convertDataTreeToObjectList(listOfLists)
    let manipulator = Helpers.findManipulator(arrayOfN, listOfObjects, n, [], 1, 0);
    console.log(manipulator);
    return manipulator;

}

export default Helpers;