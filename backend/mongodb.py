import json

import bcrypt
from bson import ObjectId, json_util
from flask import jsonify, request
from pymongo import MongoClient

from emailSender import EmailSender


db = client['users']
collection = db['identity']
collection2 = db['ads']
collection3 = db['notifications']


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

        # Ensure that the updated_data dictionary includes the original _id
        updated_data['_id'] = object_id

        # Replace the entire document with updated data
        result = collection2.replace_one({'_id': object_id}, updated_data)

        if result.matched_count > 0:
            return True
        else:
            return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


listes = []


def send_disponnible_ad(email, links):
    links_html = " ".join([f"<a href='{link}'>{link}</a>" for link in links])
    email = email
    email_sender = EmailSender(

        email_to=[email],
        email_subject="Notification annonce disponnible",
        email_message=f"""
                                    <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ROCOLIS - Annonce disponible</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                
                    <div style="background-color: #6C63FF; color: #ffffff; padding: 10px; font-size: 24px; 
                                margin: 20px 0; border-radius: 5px;"> 
                        Bonjour <br/>Une annonce ou plusieurs annonces correspondant à vos notifications sont disponibles.
                    </div>
                  <h3>lien(s) : {links_html}</h3>
                
                </body>
                </html>
                
                    """)
    if email_sender.sendEmail():
        return jsonify({"response": True})
    else:
        print("error")
        return jsonify({"response": False})


def set_notification_sent_true(_id, email):
    global can_sent_notification
    try:
        _id = ObjectId(_id)
        document = collection2.find_one({'_id': _id})
        if document:
            if 'notificationSent' not in document:
                collection2.update_one(
                    {'_id': _id},
                    {'$set': {'notificationSent': [email]}}
                )
            else:
                collection2.update_one(
                    {'_id': _id},
                    {'$addToSet': {'notificationSent': email}}
                )
            print(f"Notification sent updated for document with _id: {_id}")
            can_sent_notification = True
            return True
        else:
            print(f"Document not found: {_id}")
            return False

    except Exception as e:
        print(f"Error in set_notification_sent_true: {e}")
        return False


def get_notification_with_email(email):
    try:
        global can_sent_notification
        my_list = []
        my_liste2 = []
        cursor = collection3.find({"data": {"$ne": None}, "email": email}, {"data": 1, "_id": 0})
        for document in cursor:
            data_field = document.get('data')
            if data_field is not None:
                for k in data_field:
                    my_liste2.append(k)
        if len(my_liste2) > 0:
            for j in my_liste2:
                if check_city_in_database(j['villeDepart'], j['countryDepartName'], j['villeArrive'],
                                          j['countryArriveName'], j['dateDepart'], j['dateArrivee'], email):
                    pass
                else:
                    pass
            if can_sent_notification:
                if len(listes) > 0:
                    send_disponnible_ad(email, listes)
            can_sent_notification = False

        return listes
    except Exception as e:
        print(f"Erreur dans get_notifications : {e}")
        return []


can_sent_notification = False


def check_city_in_database(villeDepart,
                           paysDepart,
                           villeArrive,
                           paysArrive,
                           dateDepart="",
                           dateArrive="",
                           email=""):
    try:
        query = {
            "villeDepart": villeDepart,
            "paysDepart": paysDepart,
            "paysArrive": paysArrive,
            "villeArrive": villeArrive,
        }
        if dateDepart:
            query["dateDepart"] = dateDepart
        if dateArrive:
            query["dateArrive"] = dateArrive

        result = collection2.find_one(query)
        can_sent_email = False
        if result is not None:
            link = f"http://localhost:5173/searched/{result['villeDepart'].lower()}/{result['villeArrive'].lower()}/{dateDepart}"
            if result and ('notificationSent' not in result or email not in result["notificationSent"]):
                if set_notification_sent_true(result["_id"], email):
                    listes.append(link)
                    pass
                else:
                    pass
            else:
                pass
        else:
            pass

        return result is not None
    except Exception as e:
        print(f"Erreur lors de la vérification de la ville dans la base de données : {e}")
        return False


def get_all_emails():
    try:
        cursor = collection.find({}, {"email": 1, "_id": 0})
        emails = [document["email"] for document in cursor]
        for j in emails:
            print(get_notification_with_email(j))
    except Exception as e:
        print(f"Une erreur est survenue : {e}")


def delete_document(doc_id):
    try:
        object_id = ObjectId(doc_id)
        # Delete the document using delete_one
        result = collection2.delete_one({'_id': object_id})

        if result.deleted_count > 0:
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


list_document_email = []


def find_email_in_notifications(email):
    list_document = []

    try:
        cursor = collection2.find({"notificationSent": {"$exists": True, "$in": [email]}})
        results = list(cursor)

        if results:
            for result in results:
                data = {
                    "villeDepart": result.get("villeDepart", ""),
                    "villeArrive": result.get("villeArrive", ""),
                    "dateDepart": result.get("dateDepart", ""),
                    "id": str(result.get('_id', '')),
                    "paysDepart": result.get("paysDepart", ""),
                    "paysArrive": result.get("paysArrive", "")
                }
                seen_list = result.get("seen")
                if seen_list is None or email not in seen_list:
                    list_document.append(data)
            return list_document
        else:
            return []

    except Exception as e:
        print(f"Erreur lors de la recherche de l'e-mail dans la liste 'notificationSent' : {e}")
        return []


def add_token_to_document(email, token_value):
    try:
        document = collection.find_one({"email": email})
        if document:
            collection.update_one(
                {"_id": document["_id"]},
                {"$set": {"token": token_value}}
            )
            return True
        else:
            return False

    except Exception as e:
        print(f"Erreur lors de l'ajout du token au document : {e}")
        return False


def check_ik_for_email(email, provided_ik):
    try:
        document = collection.find_one({"email": email})
        if document:
            actual_ik = document.get("token", None)
            if actual_ik is not None and actual_ik == provided_ik:
                return True
            else:
                return False
        else:
            print(f"Aucun document trouvé pour l'e-mail : {email}")
            return False

    except Exception as e:
        print(f"Erreur lors de la vérification de l'attribut 'ik' : {e}")
        return False


def add_email_to_seen(_id, email):
    try:
        _id = ObjectId(_id)
        result = collection2.find_one({"_id": _id})
        if result is not None:
            seen_list = result.get("seen", [])
            if email not in seen_list:
                seen_list.append(email)
                collection2.update_one(
                    {'_id': _id},
                    {'$set': {'seen': seen_list}}
                )
                print(f"Email ajouté à la liste 'seen' pour le document avec _id: {_id}")
                return True
            else:
                print(f"L'email {email} est déjà dans la liste 'seen'")
                return False
        else:
            collection2.update_one(
                {'_id': _id},
                {'$set': {'seen': [email]}}
            )
            print(f"Liste 'seen' créée et email ajouté pour le document avec _id: {_id}")
            return True
    except Exception as e:
        print(f"Erreur dans add_email_to_seen : {e}")
        return False


