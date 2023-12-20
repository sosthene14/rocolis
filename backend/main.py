import base64
import json
import random

from bson import json_util
from flask import Flask, jsonify, request
from pymongo import MongoClient
from emailSender import EmailSender
from flask_cors import CORS
import mongodb
import jwt_

app = Flask(__name__)



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


@app.route('/api/post-data', methods=['POST'])
def handle_post_data():
    try:
        data = request.get_json()
        if mongodb.add_data(data["email"], data["nom"], data["prenom"], data["telephone"], data["paswd"],
                            data["statut"]):
            confirmationCode(data["email"])
            codes = code_liste[0]
            code_liste.clear()
            return jsonify({"response": codes})
        else:
            return jsonify({"response": False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/changing-information', methods=['POST'])
def handle_changing_information():
    try:
        data = request.get_json()
        confirmationCodeChanging(data["email"])
        codes = code_liste[0]
        code_liste.clear()
        return jsonify({"response": codes})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/make-verified', methods=['POST'])
def handel_verification():
    data = request.get_json()
    response = mongodb.make_verify(data["email"])
    return jsonify({"response": response})


@app.route('/api/ads-ad', methods=['POST'])
def add_ads():
    data = request.get_json()
    response = mongodb.add_ads(data["data"])
    return jsonify({"reponse": response})


@app.route('/api/send-jwt', methods=['POST'])
def handle_jwt():
    data = request.get_json()
    mytoken = jwt_.encode_(data["email"])
    return jsonify({"token": mytoken})


@app.route('/api/check-signed', methods=['POST'])
def handle_signed():
    data = request.get_json()
    response = mongodb.check_signed(data["email"], data["password"])
    return jsonify({"response": response})


@app.route('/api/check-is-verified', methods=['POST'])
def check_is_verified():
    data = request.get_json()
    response = mongodb.check_isverified(data["email"])
    return jsonify({"response": response})


@app.route('/confirmation_code', methods=['POST'])
def confirmationCode(email_to_send=None):
    data = email_to_send if email_to_send is not None else request.get_json()["email"]
    validation_code = generate_validation_code()
    code_liste.append(validation_code)
    email_sender = EmailSender(

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
    data = email_to_send if email_to_send is not None else request.get_json()["email"]
    detail = request.get_json()["data"]
    name = detail["nom"]
    pays_depart = detail["paysDepart"]
    pays_arrive = detail["paysArrive"]
    ville_depart = detail["villeDepart"]
    date_voyage = detail["dateDepart"]
    villeArrive = detail["villeArrive"]
    date_arrivee = detail["dateArrive"]
    kilos_dispo = detail["kilosDispo"]
    prix_kilo = detail["prixKilo"]
    discutable = detail["discutable"]
    currency = detail["currency"]
    print(currency)
    _id = request.get_json()["id"]

    email_sender = EmailSender(

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
            <li style="font-size: 16px;">Ville de départ : {ville_depart} ({pays_depart})</li>
            <li style="font-size: 16px;">Date de départ : {date_voyage}</li>
            <li style="font-size: 16px;">Ville d'arrivée : {villeArrive} ({pays_arrive})</li>
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


def send_message_to_admin(_id):
    admin1 = "sosthenemounsambote14@gmail.com"
    admin4 = "rostelherdyyoulou@gmail.com"

    email_sender = EmailSender(

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


@app.route('/api/send-confirmation-to-user', methods=['POST'])
def send_message_confirmation_to_user():
    print(request.get_json())
    email = request.get_json()["email"]
    link = request.get_json()["link"]
    email_sender = EmailSender(

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


@app.route('/api/get-all-ads', methods=['GET'])
def get_ads():
    ads = mongodb.get_validated_ads()
    return jsonify({"ads": ads})


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
    stat = mongodb.get_personnal_stat(data["email"])
    if stat:
        return stat
    else:
        return jsonify({"response": False})


@app.route("/api/update-personnal-data", methods=["POST"])
def update_personnal_data():
    data = request.get_json()
    personnal_data = mongodb.update_personnal_data(data["_id"], data["nom"], data["prenom"], data["mot_de_passe"],
                                                   data["telephone"])
    if personnal_data:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


@app.route("/api/get-user-id", methods=["POST"])
def get_user_id():
    data = request.get_json()
    stat = mongodb.get_user_id(data["email"])
    if stat:
        return jsonify({"_id": stat})
    else:
        return jsonify({"response": False})


@app.route('/api/update-doc-datas', methods=['POST'])
def update_ad():
    data = request.get_json()
    update = mongodb.update_document(data["_id"], data)

    if update:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


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
    data = request.get_json()
    print(data["document_id"])
    print(data["_id"])
    if data["document_id"] and data["_id"]:
        who_seen = mongodb.add_who_seen(data["document_id"], data["_id"])
        if who_seen:
            mongodb.update_view_based_on_whoseen(data["document_id"])
            return jsonify({"response": True})
        else:
            return jsonify({"response": False})


@app.route("/api/update-is-valided", methods=['POST'])
def update_is_valided():
    data = request.get_json()["document_id"]
    result = mongodb.update_is_valided(data)
    if result:
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


if __name__ == '__main__':
    app.run(debug=True)
