import base64
import json
import random

import bcrypt
from bson import json_util
from flask import Flask, jsonify, request
from flask_compress import Compress
from pymongo import MongoClient
from emailSender import EmailSender
from flask_cors import CORS
import mongodb
import jwt_

app = Flask(__name__)
CORS(app)
Compress(app)
client = MongoClient('""')
db = client['users']
collection = db['identity']


def generate_validation_code():
    code = ""
    for _ in range(6):
        digit = random.randint(0, 9)
        code += str(digit)
    return code


# Exemple d'utilisation

"""***********************************************************************"""

code_liste = []
email_data = []


@app.route('/')
def index():
    return jsonify(message='Bienvenue sur le serveur Flask avec MongoDB!')


def getAuthorizationToken():
    authorization_header = request.headers.get('Authorization')
    if authorization_header and authorization_header.startswith('Bearer '):
        token = authorization_header.split('Bearer ')[1]

        return token

    return None


@app.route("/api/add-to-newsletter/<string:email>", methods=["POST"])
def add_newsletter_email(email):
    emails = request.get_json()["email"]
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(email)
        if true_token == token:
            result = mongodb.add_newsletter(emails)
            if result:
                return jsonify({'response': True})
            else:
                return jsonify({'response': False})
        else:
            return jsonify({'response': "token invalide"}), 401


@app.route('/api/post-data', methods=['POST'])
def handle_post_data():
    try:
        data = request.get_json()
        if mongodb.add_data(data["email"], data["nom"], data["prenom"], data["telephone"], data["paswd"],
                            data["statut"]):
            confirmationCode(data["email"])
            codes = code_liste[0]
            hashed_code = mongodb.hash_password(codes).decode('utf-8')
            code_liste.clear()
            return jsonify({"response": hashed_code})
        else:
            return jsonify({"response": False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/changing-information/<string:email>', methods=['POST'])
def handle_changing_information(email):
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(email)
        if true_token == token:
            try:
                data = request.get_json()
                confirmationCodeChanging(data["email"])
                codes = code_liste[0]
                hashed_code = mongodb.hash_password(codes).decode('utf-8')
                code_liste.clear()
                return jsonify({"response": hashed_code})
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route('/api/make-verified/<string:email>', methods=['POST'])
def handel_verification(email):
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(email)
        if true_token == token:
            data = request.get_json()
            response = mongodb.make_verify(email)
            return jsonify({"response": response})
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route('/api/ads-ad/<string:email>', methods=['POST'])
def add_ads(email):
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(email)
        if true_token == token:
            data = request.get_json()
            response = mongodb.add_ads(data["data"])
            return jsonify({"reponse": response})
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route('/api/send-jwt', methods=['POST'])
def handle_jwt():
    data = request.get_json()
    mytoken = jwt_.encode_(data["email"])
    if mongodb.check_email_exists(data["email"]):
        return jsonify({"token": "lol"})
    else:
        if mongodb.add_token_to_document(data["email"], mytoken[1], mytoken[0]):
            return jsonify({"token": mytoken[0]})
        else:
            return jsonify({"erreur": "erreur"})


@app.route('/api/check-ik', methods=['POST'])
def check_ik():
    data = request.get_json()
    email = data["email"]
    ik = data["ik"]
    if mongodb.check_ik_for_email(email, ik):
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


def handle_jwt_signin(email):
    try:
        mytoken = jwt_.encode_(email)
        if mongodb.add_token_to_document(email, mytoken[1], mytoken[0]):
            return [True, mytoken[0]]
        else:
            return jsonify({"erreur": "erreur"})
    except Exception as e:
        return jsonify({"erreur": str(e)})


@app.route("/api/check-is-verified", methods=["POST"])
def check_is_verified():
    try:
        data = request.get_json()
        response = mongodb.check_isverified(data["email"])
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"erreur": str(e)})


@app.route('/api/check-signed', methods=['POST'])
def handle_signed():
    try:
        data = request.get_json()
        response = mongodb.check_signed(data["email"], data["password"])
        if response:
            is_verified = mongodb.check_isverified(data["email"])
            if is_verified:
                handle_signin = handle_jwt_signin(data["email"])
                if handle_signin[0]:
                    return jsonify({"token": handle_signin[1]})
                else:
                    return jsonify({"response": False})
            else:
                return jsonify({"response": False})
        else:
            return jsonify({"response": False})
    except Exception as e:
        return jsonify({"erreur": str(e)})


@app.route('/confirmation_code', methods=['POST'])
def confirmationCode(email_to_send=None):
    data = email_to_send if email_to_send is not None else request.get_json()["email"]
    validation_code = generate_validation_code()
    code_liste.append(validation_code)
    email_sender = EmailSender(
        email_from="""",
        sender_password="""",
        email_to=[data],
        email_subject="Code de validation",
        email_message=f"""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ROCOLIS - Validation de compte</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
            
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333333;">ROCOLIS</h1>
                    <p style="color: #666666;">Bienvenue sur ROCOLIS! Pour valider votre compte, utilisez le code suivant :</p>
                    
                    <div style="background-color: #6C63FF; color: #ffffff; padding: 10px; font-size: 24px; margin: 20px 0; border-radius: 5px;">
                        {validation_code}
                    </div>
            
                    <p style="color: #666666;">Utilisez ce code sur le site ROCOLIS pour confirmer votre compte.</p>
            
                    <p style="color: #666666;">Merci de faire partie de ROCOLIS!</p>
                    
                    <p style="color: red;">ignorez ce méssage si vous n'avez pas fait de demande<br/>Ce code n'est 
                    valide que pendant 1h</p>

                </div>
            
            </body>
            </html>
"""
    )
    if email_sender.sendEmail():
        code_liste.append(validation_code)
        return jsonify({"response": True, "code": validation_code})
    else:
        return jsonify({"response": False})


@app.route('/confirmation_code_data_modification', methods=['POST'])
def confirmationCodeChanging(email_to_send=None):
    data = email_to_send if email_to_send is not None else request.get_json()["email"]
    validation_code = generate_validation_code()
    code_liste.append(validation_code)
    email_sender = EmailSender(
        email_from="""",
        sender_password="""",
        email_to=[data],
        email_subject="Code de validation",
        email_message=f"""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ROCOLIS - Modification données personnelles </title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">

                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333333;">ROCOLIS</h1>
                    <p style="color: #666666;">Bonjour, vous avez demander à modifier vos données personnelles</p>

                    <div style="background-color: #6C63FF; color: #ffffff; padding: 10px; font-size: 24px; margin: 20px 0; border-radius: 5px;">
                        {validation_code}
                    </div>

                    <p style="color: #666666;">Utilisez ce code sur le site ROCOLIS pour activer la modification.</p>

                    <p style="color: #666666;">Merci de faire partie de ROCOLIS!</p>

                    <p style="color: red;">ignorez ce méssage si vous n'avez pas fait de demande<br/>Ce code n'est 
                    valide que pendant 1h</p>

                </div>

            </body>
            </html>
"""
    )
    if email_sender.sendEmail():
        code_liste.append(validation_code)
        return jsonify({"response": True, "code": validation_code})
    else:
        return jsonify({"response": False})


@app.route('/api/send-confirmation-ads-received', methods=['POST'])
def send_confirmation_data_received(email_to_send=None):
    try:
        token = getAuthorizationToken()
        data = email_to_send if email_to_send is not None else request.get_json()["email"]

        if token:
            true_token = mongodb.check_email_exists(data)

            if true_token == token:
                detail = request.get_json()["data"]
                name = detail["nom"]
                ville_depart = detail["villeDepart"]
                date_voyage = detail["dateDepart"]
                villeArrive = detail["villeArrive"]
                date_arrivee = detail["dateArrive"]
                kilos_dispo = detail["kilosDispo"]
                prix_kilo = detail["prixKilo"]
                discutable = detail["discutable"]
                currency = detail["currency"]

                _id = request.get_json()["id"]

                email_sender = EmailSender(
                    email_from="""",
                    sender_password="""",
                    email_to=[data],
                    email_subject="Confirmation de la publication",
                    email_message=f"""
                        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ROCOLIS - Confirmation annonce reçue</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">

            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; 
            border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
                <h1 style="color: #333333;">ROCOLIS</h1> 
                <p style="color: #666666;">Bonjour, vous venez de publier une annonce sur ROCOLIS</p>

                <div style="background-color: #6C63FF; color: #ffffff; padding: 10px; font-size: 24px; 
                margin: 20px 0; border-radius: 5px;"> 
                    Votre annonce a bien été reçue, elle sera examinée sous 30 minutes maximum, et 
                    vous recevrez une notification pour connaître l'état 
                </div>

                <h2>Détail de l'annonce</h2>
                <ul style="list-style: none; text-align: left; padding: 0;">
                    <li style="font-size: 16px;">Nom du voyageur : {name}</li>
                    <li style="font-size: 16px;">Ville de départ : {ville_depart}</li>
                    <li style="font-size: 16px;">Date de départ : {date_voyage}</li>
                    <li style="font-size: 16px;">Ville d'arrivée : {villeArrive}</li>
                    <li style="font-size: 16px;">Date d'arrivée : {date_arrivee}</li>
                    <li style="font-size: 16px;">Kilos Dispo : {kilos_dispo}</li>
                    <li style="font-size: 16px;">Prix Kilos : {prix_kilo} {currency}</li>
                    <li style="font-size: 16px;">Discutable : {discutable}</li>
                </ul>

                <p style="color: #666666;">Merci d'avoir choisi ROCOLIS!</p>
            </div>

        </body>
        </html>
        """)

                if email_sender.sendEmail():
                    send_message_to_admin(_id)
                    return jsonify({"response": True})
                else:
                    return jsonify({"response": False})
            else:
                return jsonify({"message": "Autorisation échouée"}), 401
        else:
            return jsonify({"message": "Token manquant"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def send_message_to_admin(_id):
    admin1 = "sosthenemounsambote14@gmail.com"
    admin4 = "rostelherdyyoulou@gmail.com"

    email_sender = EmailSender(
        email_from="""",
        sender_password="""",
        email_to=[admin1, admin4],
        email_subject="Confirmation de la publication",
        email_message=f"""
                <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROCOLIS - Confirmation annonce reçue</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
   <div>
   <h1>Nouvelle soumission avec pour Id :{_id} </h1>
   </div>
</body>
</html>
""")
    if email_sender.sendEmail():
        print("succes")
    else:
        print("erreur")


@app.route('/api/get-all-ads/<string:email>', methods=['GET'])
def get_ads(email):
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(email)
        if true_token == token:
            ads = mongodb.get_validated_ads()
            return jsonify({"ads": ads})
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route('/api/get-invalided-ads', methods=['GET'])
def get_invalided_ads():
    ads = mongodb.get_invalidated_ads()
    return jsonify({"invalided-ads": ads})


@app.route('/api/get-all-user', methods=['GET'])
def get_all_users():
    response = mongodb.get_all_users()
    return jsonify({"users": response})


@app.route("/api/delete-ads", methods=['POST'])
def delete_ads():
    data = request.get_json()
    ads = mongodb.delete_ads(data["_id"])
    if ads:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


@app.route("/api/get-stats", methods=["POST"])
def get_stats():
    data = request.get_json()
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(data["email"])
        if true_token == token:
            stat = mongodb.get_personnal_stat(data["email"])
            if stat:
                return stat
            else:
                return jsonify({"response": False})
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route("/api/get-phone-number", methods=['POST'])
def get_phone():
    try:
        data = request.get_json()
        email = data.get('email')
        token = getAuthorizationToken()
        if not email or not token:
            raise ValueError("Email or token is missing in the request data.")
        telephone = mongodb.get_phone_number_by_true_token(token, email)
        if telephone:
            return jsonify({"telephone": telephone})
        else:
            raise ValueError("No matching user found for the provided token and email.")
    except Exception as e:
        return jsonify({"message": "Autorisation échouée", "error": str(e)}), 401


@app.route("/api/update-personnal-data/<string:email>", methods=["POST"])
def update_personnal_data(email):
    try:
        token = getAuthorizationToken()

        if token:
            true_token = mongodb.check_email_exists(email)
            if true_token == token:
                data = request.get_json()
                try:
                    personnal_data = mongodb.update_personnal_data(
                        data["_id"], data["nom"], data["prenom"], data["mot_de_passe"], data["telephone"]
                    )
                    if personnal_data:
                        return jsonify({"response": True})
                    else:
                        return jsonify({"response": False})
                except Exception as e:
                    return jsonify({"error": str(e)}), 500
        return jsonify({"message": "Autorisation échouée"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get-user-id", methods=["POST"])
def get_user_id():
    data = request.get_json()
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(data["email"])

        if true_token == token:
            stat = mongodb.get_user_id(data["email"])
            if stat:
                return jsonify({"_id": stat})
            else:
                return jsonify({"response": False})
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route('/api/update-doc-datas/<string:email>', methods=['POST'])
def update_ad(email):
    data = request.get_json()
    token = getAuthorizationToken()
    if token:
        true_token = mongodb.check_email_exists(email)
        if true_token == token:
            update = mongodb.update_document(data["_id"], data['data'])
            if update:
                return jsonify({"response": True})
            else:
                return jsonify({"response": False})
    return jsonify({"message": "Autorisation échouée"}), 401


@app.route('/api/delete-doc-datas/<string:email>', methods=['POST'])
def delete_ad(email):
    try:
        data = request.get_json()
        token = getAuthorizationToken()
        if not token:
            raise ValueError("Authorization token is missing.")
        true_token = mongodb.check_email_exists(email)
        if true_token != token:
            raise ValueError("Authorization failed. Tokens do not match.")
        update = mongodb.delete_document(data["_id"])
        if update:
            return jsonify({"response": True})
        else:
            raise ValueError("Failed to delete document.")
    except Exception as e:
        return jsonify({"message": "Autorisation échouée", "error": str(e)}), 401


@app.route('/api/get-documents-by-publisher/<string:email>', methods=['GET'])
def get_documents_route(email):
    try:
        token = getAuthorizationToken()

        if not token:
            raise ValueError("Authorization token is missing.")

        true_token = mongodb.check_email_exists(email)

        if true_token != token:
            raise ValueError("Authorization failed. Tokens do not match.")

        # Utilisez la fonction pour récupérer les documents par éditeur
        return mongodb.get_documents_by_publisher(email)

    except Exception as e:
        return jsonify({"message": "Autorisation échouée", "error": str(e)}), 401


@app.route('/api/add-notifications', methods=['POST'])
def add_notifications():
    data = request.get_json()
    add = mongodb.add_notifications(data["email"], data["notifications"])
    if add:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


@app.route('/api/get-notifications', methods=['POST'])
def get_notifications():
    get_no = mongodb.get_notifications()
    if get_no is not None:
        return jsonify({"data": get_no})
    else:
        return jsonify({"response": False})


@app.route('/api/delete-notifications', methods=['POST'])
def delete_notifications():
    email = request.get_json()["email"]
    ids = request.get_json()["id"]
    delete_no = mongodb.delete_notification(email, ids)
    if delete_no is not None:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


@app.route("/api/add-who-seen", methods=['POST'])
def add_who_seen():
    try:
        data = request.get_json()
        if len(data) > 0 and data.get("document_id") and data.get("_id"):
            document_id = data["document_id"]
            _id = data["_id"]
            if document_id != "" and _id != "":
                who_seen = mongodb.add_who_seen(document_id, _id)
                if who_seen:
                    mongodb.update_view_based_on_whoseen(document_id)
                    return jsonify({"response": True})
        raise ValueError("Invalid data provided.")
    except Exception as e:
        return jsonify({"response": False, "error": str(e)})


@app.route("/api/check-notifications", methods=['GET'])
def checking_noti():
    mongodb.get_all_emails()
    data = {'message': 'notifications initalisées'}
    return jsonify(data)


@app.route('/api/get-notifications-with-email', methods=['POST'])
def send_noti_to_client():
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            raise ValueError("Email parameter is missing in the request data.")
        token = getAuthorizationToken()
        if not token:
            raise ValueError("Authorization token is missing.")
        true_token = mongodb.check_email_exists(email)
        if true_token != token:
            raise ValueError("Authorization failed. Tokens do not match.")
        notifications_data = mongodb.get_notification_with_email(email)
        return jsonify({"data": notifications_data})

    except Exception as e:
        return jsonify({"message": "Autorisation échouée", "error": str(e)}), 401


@app.route('/api/add-email-to-seen', methods=['POST'])
def add_email_to_seen():
    try:
        data = request.get_json()
        email = data.get('email')
        _id = data.get('_id')
        token = getAuthorizationToken()
        if not email or not _id or not token:
            raise ValueError("Email, _id, or token is missing in the request data.")
        true_token = mongodb.check_email_exists(email)
        if true_token != token:
            raise ValueError("Authorization failed. Tokens do not match.")
        result = mongodb.add_email_to_seen(_id, email)
        if result:
            return jsonify({"response": True})
        else:
            raise ValueError("Failed to add email to seen.")
    except Exception as e:
        return jsonify({"response": False, "error": str(e)})


@app.route('/api/check-admin-pwd', methods=['POST'])
def check_admin_pwd():
    try:
        hashed_pwd_from_request = request.get_json()['pwd']
        pwd_in_db = "12345"
        result = verify_password(pwd_in_db, hashed_pwd_from_request)
        return jsonify({"message": "Vérification réussie !", "result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def verify_password(plain_password, hashed_password):
    if not isinstance(hashed_password, bytes):
        hashed_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)


@app.route('/api/email-exist', methods=['POST'])
def check_exist_email():
    email = request.get_json()['email']
    result = mongodb.check_email_exists(email)
    if result:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


@app.route("/api/unverified-ads", methods=['POST'])
def make_unverified_ads():
    try:
        token_to_compare = "123456"
        token = getAuthorizationToken()
        if not token:
            raise ValueError("Authorization token is missing.")
        if token_to_compare != token:
            raise ValueError("Authorization failed. Tokens do not match.")
        data = request.get_json()["document_id"]
        result = mongodb.update_is_valided(data)
        if result:
            return jsonify({"response": True})
        else:
            return jsonify({"response": False})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/verified-ads", methods=['POST'])
def make_verified_ads():
    try:
        token_to_compare = "123456"
        token = getAuthorizationToken()

        if not token:
            raise ValueError("Authorization token is missing.")
        if token_to_compare != token:
            raise ValueError("Authorization failed. Tokens do not match.")
        data = request.get_json()["document_id"]
        result = mongodb.update_is_valided(data)
        if result:
            return jsonify({"response": True})
        else:
            return jsonify({"response": False})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route('/api/send-confirmation-to-user', methods=['POST'])
def send_message_confirmation_to_user():
    try:
        token_to_compare = "123456"
        email = request.get_json()["email"]
        link = request.get_json()["link"]
        token = getAuthorizationToken()

        if not token:
            raise ValueError("Authorization token is missing.")

        if token_to_compare != token:
            raise ValueError("Authorization failed. Tokens do not match.")

        email_sender = EmailSender(
            email_from="""",
            sender_password="""",
            email_to=[email],
            email_subject="Annonce Publiée",
            email_message=f"""
                <!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ROCOLIS - Confirmation annonce publiée</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                       
                            <div style="background-color: #6C63FF; color: #ffffff; padding: 10px; font-size: 24px; 
                            margin: 20px 0; border-radius: 5px;"> 
                                Votre annonce a bien été publié<br/>
                                lien vers l'annonce : {link}
                            </div>
                    </body>
                    </html>
            """)

        if email_sender.sendEmail():
            return jsonify({"response": True})
        else:
            return jsonify({"response": False})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/send-invalided-ads-to-user', methods=['POST'])
def send_message_invalided_ads_to_user():
    try:
        token_to_compare = "123456"
        email = request.get_json()["email"]
        token = getAuthorizationToken()

        if not token:
            raise ValueError("Authorization token is missing.")

        if token_to_compare != token:
            raise ValueError("Authorization failed. Tokens do not match.")

        email_sender = EmailSender(
            email_from="""",
            sender_password="""",
            email_to=[email],
            email_subject="Annonce Non Publiée",
            email_message=f"""
                <!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ROCOLIS - Confirmation annonce non publiée</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                       
                            <div style="background-color: #6C63FF; color: #ffffff; padding: 10px; font-size: 24px; 
                            margin: 20px 0; border-radius: 5px;"> 
                                Votre annonce n'a pas  malheureusement été publiée<br/>
                                cause : Annonce non conforme
                            </div>
                    </body>
                    </html>
            """)

        if email_sender.sendEmail():
            return jsonify({"response": True})
        else:
            return jsonify({"response": False})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/delete-expired-ads', methods=['POST'])
def get_expired_ads():
    try:
        return jsonify(mongodb.delete_expired_ads())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/get-recents-ads', methods=['GET'])
def get_recent_ads():
    try:
        data = mongodb.get_recent_articles()
        return jsonify({"data": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
