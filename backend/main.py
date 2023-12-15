import base64
import random
from flask import Flask, jsonify, request
from pymongo import MongoClient
from emailSender import EmailSender
from flask_cors import CORS
import mongodb
import jwt_

app = Flask(__name__)
CORS(app)

client = MongoClient('')
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
        email_from="",
        sender_password="",
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
        email_from="",
        sender_password="",
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


@app.route('/api/get-all-ads', methods=['GET'])
def get_ads():
    ads = mongodb.get_all_ads()
    return jsonify({"ads": ads})


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


@app.route("/api/add-who-seen", methods=['POST'])
def add_who_seen():
    data = request.get_json()
    who_seen = mongodb.add_who_seen(data["document_id"], data["_id"])
    if who_seen:
        mongodb.update_view_based_on_whoseen(data["document_id"])
        return jsonify({"response": True})
    else:
        return jsonify({"response": False})


if __name__ == '__main__':
    app.run(debug=True)
