from jproperties import Properties


def addProperty(file, key, value):
    with open(file, "r+b") as f:
        p = Properties(process_escapes_in_values=False)
        p.load(f, "utf-8")
        p[key] = value
        f.seek(0)
        f.truncate(0)
        p.store(f, encoding="utf-8")
        f.close()


def removeProperty(file, key):
    with open(file, "r+b") as f:
        p = Properties(process_escapes_in_values=False)
        p.load(f, "utf-8")
        del p[key]
        f.seek(0)
        f.truncate(0)
        p.store(f, encoding="utf-8")
        f.close()


def readProperty(file, key):
    try:
        with open(file, "r+b") as f:
            p = Properties(process_escapes_in_values=False)
            p.load(f, "utf-8")
            f.close()
            return p[key]

    except:
        pass


def getPropertiesToMove():
    propertiesToMove = Properties()
    with open("./propertiesToMove.properties", "rb") as f:
        propertiesToMove.load(f, "utf-8")
    return propertiesToMove.items()


originFile = 'record'
destinationFile = 'top-bar'
languages = [
    'ar', 'cs', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh-CN',
    'zh-TW', 'xx', 'src', 'lr', 'rl', 'uk', 'ca'
]

propertiesToMove = getPropertiesToMove()


def buildFilePath(originFile, language):
    return './' + originFile + '/' + originFile + '.' + language + '.' + 'properties'


for property in propertiesToMove:
    print("MOVING " + property[0])
    for language in languages:
        originFilePath = buildFilePath(originFile, language)
        destinationFilePath = buildFilePath(destinationFile, language)
        movingKey = property[0]
        propertyTuple = readProperty(originFilePath, movingKey)
        print(propertyTuple)
        if not (propertyTuple is None):
            print(propertyTuple)
            movingValue = propertyTuple.data
            movingAdaptedKey = destinationFile + '.' + movingKey.replace(
                '-', '').split('.')[1]
            print('movingAdaptedKey ', movingAdaptedKey)
            ## DELETE ORIGIN
            removeProperty(originFilePath, movingKey)
            ## ADD TO DESTINTION
            addProperty(destinationFilePath, movingAdaptedKey, movingValue)
