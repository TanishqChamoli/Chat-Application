from urllib import response
import pymongo
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import datetime

dbConnection = pymongo.MongoClient("mongodb+srv://tanishq:tanishq@chat-messages.whb0n.mongodb.net/myFirstDatabase")
userDB = dbConnection['chat-application']['users']
connectionsDB = dbConnection['chat-application']['connections']
chatDB = dbConnection['chat-application']['messages']

def checkIfEmailExists(email):
    data = userDB.find({'email': email}, {'_id': 1})
    return len(list(data)) > 0

def getRsaInfo():
    key = RSA.generate(2048)
    privateKey = key.export_key()
    publicKey = key.publickey().export_key()
    return publicKey, privateKey

def encryptText(strKey, data):
    private_key = RSA.import_key(strKey)
    public_key = private_key.publickey()
    # Encrypt the data key with the public RSA key
    cipher_rsa = PKCS1_OAEP.new(public_key)
    enc_data = cipher_rsa.encrypt(data.encode('utf-8'))
    return enc_data

def decryptText(strKey, enc_data):
    private_key = RSA.import_key(strKey)
    # Decrypt the data with the private RSA key
    cipher_rsa = PKCS1_OAEP.new(private_key)
    dec_data = cipher_rsa.decrypt(enc_data)
    return dec_data

def create_user(userData):
    if checkIfEmailExists(userData['email']):
        return {'status': 400, 'message': 'Duplicate Email/Email already exists'}
    userData['pubKey'], userData['priKey'] = getRsaInfo()
    userData['password'] = base64.b64encode(
        userData['password'].encode("utf-8"))

    # need to be encoded afterwards
    userData['pubKey'] = userData['pubKey'].decode("utf-8")
    userData['priKey'] = userData['priKey'].decode("utf-8")

    user = userDB.insert_one(userData)
    if user.acknowledged:
        connectionsDB.insert_one({
            'email': userData['email'],
            'connections': []
        })
        return {'status': 201, 'message': 'User created successfully'}
    else:
        return {'status': 400, 'message': 'Failed creating the user'}

def login_user(userData):
    userData['password'] = base64.b64encode(
        userData['password'].encode("utf-8"))
    data = userDB.find_one({"email": userData['email'], "password": userData['password']}, {
                           '_id': 0, "name": 1, "email": 1, "pubKey": 1})
    if data:
        return {'status': 200, 'token': data}
    else:
        return {'status': 400, 'message': 'Invalid email or password'}

def getUserConnections(userData):
    connectionInfo = connectionsDB.find_one({"email": userData['email']}, {'_id': 0, 'connections': 1})['connections']
    return {'status': 200, 'connections': list(connectionInfo)}

def addNewConnection(userData):
    newFriend = connectionsDB.find_one(
        {"email": userData['friend']}, {'_id': 0})
    if not newFriend:
        return {'status': 400, 'message': 'Error data not found'}
    if {'email': userData['mail'], 'name': userData['name']} in newFriend['connections']:
        return {'status': 400, 'message': 'You are already friends'}
    friendName = userDB.find_one({"email": userData['friend']}, {
                                 '_id': 0, 'name': 1})['name']
    user1 = connectionsDB.update_one({"email": userData['mail']}, {
                                     '$push': {'connections': {'email': userData['friend'], 'name': friendName}}})
    user2 = connectionsDB.update_one({"email": userData['friend']}, {'$push': {
                                     'connections': {'email': userData['mail'], 'name': userData['name']}}})
    if user1.acknowledged and user2.acknowledged:
        return {'status': 200, 'message': 'Friend Added'}
    else:
        return {'status': 400, 'message': 'Failed in adding friends'}

def insertMessage(userData):
    senderPri = userDB.find_one({"email": userData['sender']}, {'_id': 0, 'priKey': 1})
    recieverPri = userDB.find_one({"email": userData['reciever']}, {'_id': 0, 'priKey': 1})
    senderData = encryptText(senderPri['priKey'], userData['message'])
    recieverData = encryptText(recieverPri['priKey'], userData['message'])
    messageInDb = chatDB.insert_one({
        "sender": userData['sender'],
        "reciever": userData['reciever'],
        "senderData": senderData,
        "recieverData": recieverData,
        "date": datetime.datetime.now(),
        "status":False
    })
    if messageInDb.acknowledged:
        return {'status': 200, 'message': 'Success'}
    else:
        return {'status': 400, 'message': 'Failed'}

def returnMessages(userData):
    try:
        messageData = []
        senderPri = userDB.find_one({"email": userData['own']}, {'_id': 0, 'priKey': 1})
        messages = list(chatDB.find({"$or": [{'sender': userData['friend'],'reciever':userData['own']},{'sender': userData['own'],'reciever':userData['friend']}]}, {'_id': 0}).sort('date',pymongo.DESCENDING) )
        messages = messages[::-1]
        for message in messages:
            if message['sender']==userData['own']:
                decMessage = decryptText(senderPri['priKey'], message['senderData'])
            else:
                decMessage = decryptText(senderPri['priKey'],message['recieverData'])
            message['message']=decMessage.decode('utf-8')
            message.pop('senderData')
            message.pop('recieverData')
            message['id'] = str(message['date'])
            message['date'] = str(message['date'].time().strftime("%H:%M"))
            messageData.append(message)
        response = updateMessageStatus(userData)
        if response['status']==200:
            return {'status':200,'data':messageData}
        else:
            return {'status':400,'message':response['message']}
    except Exception as e:
        return {'status':400,'message':f"Failed getting the messages due to error: {e}"}

def checkMessages(userData):
    mIds = list(chatDB.find({"$or": [{'sender': userData['friend'],'reciever':userData['own']},{'sender': userData['own'],'reciever':userData['friend']}]},{'_id':1}))
    return {'status':200,'count':len(mIds)}

def updateMessageStatus(userData):
    updateStatus = chatDB.update_many({'sender': userData['friend'],'reciever':userData['own']},{'$set':{'status':True}})
    if updateStatus.acknowledged:
        return {'status':200,'message':'Successfull change the message status'}
    else:
        return {'status':400,'message':'Message status change failed'}



if __name__ == '__main__':
    # print(returnMessages({'own': 'tanishq@tanishq.com', 'friend': 'sonam@sonam.com'}))
    print(checkMessages({'own': 'tanishq@tanishq.com', 'friend': 'sonam@sonam.com'}))
    # pub,pri = getRsaInfo()
    # decryptText(pri,"Hello tanishq")
