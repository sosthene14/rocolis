import json

import bcrypt
from bson import ObjectId, json_util
from pymongo import MongoClient




def check_email_exists(email):
    return collection.find_one({'email': email}) is not None


liste = []


def json_util_handler(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError("Type not serializable")


def update_document(doc_id, updated_data):
    try:
        object_id = ObjectId(doc_id)
        updated_data.pop('_id', None)
        # Update the document using update_one
        result = collection2.update_one({'_id': object_id}, {'$set': updated_data})
        if result.matched_count > 0:
            return True
        else:
            return False

    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def update_personnal_data(_id, nom, prenom, mot_de_passe, telephone):
    try:
        object_id = ObjectId(_id)
        result = collection.update_one({'_id': object_id}, {
            '$set': {
                'nom': nom,
                'prenom': prenom,
                'mot_de_passe': hash_password(mot_de_passe),
                'telephone': telephone
            }
        })
        if result.modified_count > 0:
            return True
        else:
            return False
    except Exception as e:
        print(f"Erreur lors de la mise à jour : {e}")
        return False


def add_notifications(email, data):
    existing_user = collection3.find_one({'email': email})
    try:
        if existing_user:
            collection3.update_one({'email': email}, {'$set': {'data': data}})
        else:
            new_user = {'email': email, 'data': data}
            collection3.insert_one(new_user)
        return True
    except:
        return False


def delete_notification(email, notification_id):
    user_query = {'email': email}
    user = collection3.find_one(user_query)
    if not user:
        return False

    # Utilisez $pull pour supprimer l'élément du tableau 'data' par 'id'
    collection3.update_one(
        {'email': email},
        {'$pull': {'data': {'id': notification_id}}}
    )

    return True


def get_notifications():
    try:
        my_list = []
        my_liste2 = []
        cursor = collection3.find({"data": {"$ne": None}}, {"data": 1, "_id": 0})
        for document in cursor:
            data_field = document.get('data')
            if data_field is not None:
                my_list.append(data_field)
        for j in my_list:
            for k in j:
                my_liste2.append(k)
        return my_liste2
    except Exception as e:
        print(f"Error in get_validated_ads_data: {e}")
        return []


def get_all_users():
    try:
        cursor = collection.find({})
        result = list(cursor)
        return json.loads(json_util.dumps(result))
    except Exception as e:
        print(f"Error: {e}")
        return []


def get_validated_ads():
    try:
        cursor = collection2.find({"isValided": True})
        result = list(cursor)
        return json.loads(json_util.dumps(result))
    except Exception as e:
        print(f"Error in get_validated_ads: {e}")
        return []


def get_invalidated_ads():
    try:
        cursor = collection2.find({"isValided": False})
        result = list(cursor)
        return json.loads(json_util.dumps(result))
    except Exception as e:
        print(f"Error in get_validated_ads: {e}")
        return []


def make_verify(email):
    if check_email_exists(email):
        result = collection.update_one(
            {'email': email},
            {'$set': {'isverified': True}}
        )
        if result.modified_count > 0:
            return {'success': True, 'message': 'La vérification a réussi.'}
        else:
            return {'success': False, 'message': 'La vérification a échoué.'}
    else:
        return {'success': False, 'message': 'L\'email n\'existe pas.'}


def delete_ads(ad_id):
    try:
        object_id = ObjectId(ad_id)
        result = collection2.delete_one({'_id': object_id})
        if result.deleted_count > 0:
            return True
        else:
            return False

    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def update_view_based_on_whoseen(_id):
    object_id = ObjectId(_id)
    existing_doc = collection2.find_one({'_id': object_id})
    if existing_doc and 'whoSeen' in existing_doc:
        view_value = len(existing_doc['whoSeen'])
        collection2.update_one({'_id': object_id}, {'$set': {'view': view_value}})
        return True
    return False


def check_signed(email, password):
    user = collection.find_one({'email': email})
    if user:
        if check_password(password, user['mot_de_passe']):
            return True
    return False


def get_number_of_publications(email):
    user = collection.find_one({'email': email})
    if user:
        return


def add_who_seen(_id, viewer_id):
    try:
        object_id = ObjectId(_id)
        viewer_id = ObjectId(viewer_id)
        existing_doc = collection2.find_one({'_id': object_id})

        if existing_doc:
            if 'whoSeen' in existing_doc:
                if viewer_id not in existing_doc['whoSeen']:
                    collection2.update_one({'_id': object_id}, {'$addToSet': {'whoSeen': viewer_id}})
                    return True
            else:
                collection2.update_one({'_id': object_id}, {'$set': {'whoSeen': [viewer_id]}})
                return True

        else:
            new_doc = {'_id': object_id, 'whoSeen': [viewer_id]}
            collection2.insert_one(new_doc)
            return True

    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def get_personnal_stat(email):
    try:
        result = collection.find_one({"email": email})
        if result:
            return {
                "nom": result.get("nom"),
                "prenom": result.get("prenom"),
                "telephone": result.get("telephone"),
                "email": result.get("email"),
                "mot_de_passe": str(result.get("mot_de_passe").decode('utf-8')),
                "_id": str(result.get("_id"))
            }
        else:
            return False

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def get_user_id(email):
    user_data = collection.find_one({'email': email})
    if user_data:
        return str(user_data['_id'])
    return None


def check_isverified(email):
    return collection.find_one({'email': email, 'isverified': True}) is not None


def hash_password(password):
    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password


# Function to check if a password matches its hashed version
def check_password(input_password, hashed_password):
    # Check if the input password matches the hashed password
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password)


def add_ads(data):
    try:
        collection2.insert_one(data)
        return str(data["_id"])
    except:
        return False


def update_is_valided(document_id):
    object_id = ObjectId(document_id)
    document = collection2.find_one({"_id": object_id})
    try:
        if document:
            new_value = not document.get("isValided", False)
            collection2.update_one({"_id": object_id}, {"$set": {"isValided": new_value}})
            print(f"Document avec l'ID {object_id} mis à jour avec isValided={new_value}")
            return True
        else:
            print(f"Document avec l'ID {object_id} non trouvé.")
            return False
    except Exception as e:
        print(f"Erreur lors de la mise à jour : {e}")
        return False


def add_data(email, nom, prenom, telephone, mot_de_passe, statut):
    if not check_email_exists(email):
        new_data = {
            'email': email,
            'nom': nom,
            'prenom': prenom,
            'telephone': telephone,
            'mot_de_passe': hash_password(mot_de_passe),
            "isverified": False,
            "isbanned": False,
            "statut": statut
        }
        collection.insert_one(new_data)
        return True
    else:
        return False
