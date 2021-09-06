from flask import Flask, jsonify, request, json, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.elements import Null

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.secret_key = 'ADHJKREEFOEKFADHJKVERTRBDRE1231245'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False) 
    initial_price = db.Column(db.Integer, nullable=False)
    last_bid = db.Column(db.Integer, nullable=False)
    last_bid_user = db.Column(db.String(25))

class AutoBids(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, nullable=False)
    user = db.Column(db.String(25), nullable=False)

class UserConfigs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(25), nullable=False)
    max_bid_amount = db.Column(db.Integer, nullable=False)

def __str__(self):
    return f'{self.content}, {self.id}'

def item_serializer(item):
    return {
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'initial_price': item.initial_price,
        'last_bid': item.last_bid,
        'last_bid_user': item.last_bid_user
    }

def autobid_engine(autobids, item):

    for autobid in autobids:
        print("Entra 1")
        if item.last_bid_user != autobid.user:
            user_config = UserConfigs.query.filter_by(user=autobid.user).first()
            items_autobids = UserConfigs.query\
                .join(AutoBids, UserConfigs.user == AutoBids.user)\
                .join(Item, AutoBids.item_id == Item.id)\
                .add_columns(Item.last_bid)\
                .filter(AutoBids.user == autobid.user)\
                .filter(Item.last_bid_user == autobid.user).all()
            
            max_bid_amount = user_config.max_bid_amount

            for item_autobid in items_autobids:
                max_bid_amount -= item_autobid.last_bid

            if max_bid_amount < item.last_bid + 1:
                break

            item.last_bid_user = autobid.user
            item.last_bid = item.last_bid + 1
            autobid_engine(autobids, item)
            break

@app.route('/home', methods=['GET'])
def index():
    if session.get('user') is None:
        session['user'] = 'user1'
        
    return jsonify([*map(item_serializer, Item.query.all())])

@app.route('/item-detail/<int:id>')
def create(id):
    return jsonify([*map(item_serializer, Item.query.filter_by(id=id))])

@app.route('/bid/<int:id>', methods=['POST'])
def bid(id):
    request_data = json.loads(request.data)
    item = Item.query.filter_by(id=request_data['id']).first()
    if int(request_data['bid']) >= item.last_bid + 1:
        autobids = AutoBids.query.filter_by(item_id=id).all()

        item.last_bid = int(request_data['bid'])
        item.last_bid_user = session.get('user')

        autobid_engine(autobids, item)

        db.session.commit()
        return jsonify({'value':'OK'})
    else:
        return jsonify({'value':'NOK'})

@app.route('/user')
def getUser(): 
    user_config = UserConfigs.query.filter_by(user=session.get('user')).first()       
    return jsonify({'user':session.get('user'), 'max_bid':user_config.max_bid_amount})

@app.route('/set-user', methods=['POST'])
def setUser():    
    request_data = json.loads(request.data)
    if session.get('user') != request_data['id']:
        if session.get('user') == 'user1':
            session['user'] = 'user2'
        else:
            session['user'] = 'user1'

    return 'OK'

@app.route('/get-autobid/<int:id>')
def getAutobid(id):        
    relation = AutoBids.query.filter_by(item_id=id, user=session.get('user')).first()
    if relation is None:
        return jsonify({'state':False})
    else:
        return jsonify({"state":True})

@app.route('/set-autobid', methods=['POST'])
def setAutobid():
    request_data = json.loads(request.data)    
    relation = AutoBids.query.filter_by(item_id=request_data['id'], user=session.get('user')).first()    
    
    if request_data['state']:
        if relation is None:
            relation = AutoBids()
            relation.item_id = request_data['id']
            relation.user = session.get('user')
            db.session.add(relation)
    else:
        if relation is not None:
            db.session.delete(relation)
    
    db.session.commit()

    return 'OK'

@app.route('/set-max-bid', methods=['POST'])
def setMaxBid():
    request_data = json.loads(request.data)
    user_config = UserConfigs.query.filter_by(user=session.get('user')).first()
    
    user_config.max_bid_amount = request_data['max_bid']
    db.session.commit()

    return 'OK'
    
if __name__ == "__main__":
    app.run(debug=True)