import pymongo
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

dbConnection = pymongo.MongoClient("mongodb+srv://tanishq:tanishq@chat-messages.whb0n.mongodb.net/myFirstDatabase")
userDB = dbConnection['chat-application']['users']
connectionsDB = dbConnection['chat-application']['connections']
chatDB = dbConnection['chat-application']['messages']

secret_key = b"this_is_secrect_key"

def checkIfEmailExists(email):
    data = userDB.find({'email':email}, {'_id': 1})
    return len(list(data))>0

def getRsaInfo():
    key = RSA.generate(2048)
    privateKey = key.export_key()
    publicKey = key.publickey().export_key()
    return publicKey,privateKey

def encryptText(strKey,data):
    private_key = RSA.import_key(strKey)
    public_key = private_key.publickey()
    # Encrypt the data key with the public RSA key
    cipher_rsa = PKCS1_OAEP.new(public_key)
    enc_data = cipher_rsa.encrypt(data.encode('utf-8'))
    return enc_data

def decryptText(strKey,enc_data):
    private_key = RSA.import_key(strKey)
    # Decrypt the data with the private RSA key
    cipher_rsa = PKCS1_OAEP.new(private_key)
    dec_data = cipher_rsa.decrypt(enc_data)
    return dec_data

def create_user(userData):
    if checkIfEmailExists(userData['email']):
        return {'status':400,'message':'Duplicate Email/Email already exists'}
    userData['pubKey'],userData['priKey'] = getRsaInfo()
    userData['password'] = base64.b64encode(userData['password'].encode("utf-8"))
    
    # need to be encoded afterwards
    userData['pubKey']=userData['pubKey'].decode("utf-8")
    userData['priKey']=userData['priKey'].decode("utf-8")

    user = userDB.insert_one(userData)
    if user.acknowledged:
        connectionsDB.insert_one({
            'email':userData['email'],
            'connections':[]
        })
        return {'status':201,'message':'User created successfully'}
    else:
        return {'status':400,'message':'Failed creating the user'}

def login_user(userData):
    userData['password'] = base64.b64encode(userData['password'].encode("utf-8"))
    data = userDB.find_one({"email":userData['email'],"password":userData['password']},{'_id':0,"name":1,"email":1,"pubKey":1})
    if data:
        return {'status':200,'token':data}
    else:
        return {'status':400,'message':'Invalid email or password'}

def getUserConnections(userData):
    connectionInfo = connectionsDB.find_one({"email":userData['email']},{'_id':0,'connections':1})['connections']
    return {'status':200,'connections':list(connectionInfo)}

def addNewConnection(userData):
    newFriend = connectionsDB.find_one({"email":userData['addMail']},{'_id':0,'name':1,'connections':1})
    if not newFriend:
        return {'status':400,'message':'Error data not found'}
    if {'email':userData['userMail'],'name':userData['name']} in newFriend['connections']:
        return {'status':400,'message':'You are already friends'}
    newFriend = newFriend['connections'][0]
    print(newFriend)
    user1 = connectionsDB.update_one({"email":userData['userMail']}, {'$push': {'connections':{'email':userData['addMail'],'name':newFriend['name']}}})
    user2 = connectionsDB.update_one({"email":userData['addMail']}, {'$push': {'connections':{'email':userData['userMail'],'name':userData['name']}}})
    if user1.acknowledged and user2.acknowledged:
        return {'status':200,'message':'Friend Added'}
    else:
        return {'status':400,'message':'Failed in adding friends'}

def insertMessage(userData):
    senderPri = userDB.find_one({"email":userData['sender']},{'_id':0,'priKey':1})
    recieverPri = userDB.find_one({"email":userData['reciever']},{'_id':0,'priKey':1})
    senderData = encryptText(senderPri,userData['message'])
    recieverData = encryptText(recieverPri,userData['message'])
    chatDB.insert_one({"sender":userData['sender'],"reciever":userData['reciever'],"senderData":senderData,"recieverData":recieverData})


if __name__ == '__main__':
    pub,pri = getRsaInfo()
    decryptText(pri,"Hello tanishq")
