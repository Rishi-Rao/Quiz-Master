from datetime import datetime
from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import *


api = Api(prefix='/api')
sub_fields = {
    'id' : fields.Integer,
    'name' : fields.String,
    'description' : fields.String,
}
chap_fields = {
    'id' : fields.Integer,
    'sub_id' : fields.Integer,
    'name' : fields.String,
    'description' : fields.String,
}
quiz_fields = {
    'id' : fields.Integer,
    'chap_id' : fields.Integer,
    'doq' : fields.DateTime,
    'duration' : fields.String,
    'remarks' : fields.String,
}
q_fields = {
    'id' : fields.Integer,
    'quiz_id' : fields.Integer,
    'question' : fields.String,
    'opt1' : fields.String,
    'opt2' : fields.String,
    'opt3' : fields.String,
    'opt4' : fields.String,
    'answer' : fields.String,
    
}

class SubAPI(Resource):
    @marshal_with(sub_fields)
    @auth_required('token')
    def get(self, sub_id):
        sub = Subject.query.filter_by(id=sub_id).first()
        if not sub:
            return {"message" : "not found"}, 404
        return sub
    
    @auth_required('token')
    def delete(self, sub_id):
        sub = Subject.query.filter_by(id=sub_id).first()
        if not sub:
            return {"message" : "not found"}, 404
        
        if 1 == current_user.id:
            db.session.delete(sub)
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403
    
    @auth_required('token')
    def put(self,sub_id):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        sub = Subject.query.filter_by(id=sub_id).first()
        sub.name=name
        sub.description=description
        db.session.commit()
        return jsonify({'message' : 'subject updated'})
        
class SubListAPI(Resource):
    # returns all the subjects
    @marshal_with(sub_fields)
    @auth_required('token')
    def get(self ):
        print(current_user.roles[0])
        sub = Subject.query.all()
        return sub
    
    # creates new subject
    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        sub = Subject(name = name, description = description)
        db.session.add(sub)
        db.session.commit()
        return jsonify({'message' : 'subject created'})
        
class ChapAPI(Resource):
    # gets all chapters with sub_id = id
    @marshal_with(chap_fields)
    @auth_required('token')
    def get(self, id):
        sub = Chapter.query.filter_by(sub_id=id).all()
        if not sub:
            return {"message" : "not found"}, 404
        return sub
    
    # deletes all chapters with chap_id = id
    @auth_required('token')
    def delete(self, id):
        chap = Chapter.query.get(id)
        if not chap:
            return {"message" : "not found"}, 404
        
        if 1 == current_user.id:
            db.session.delete(chap)
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403
        
    @auth_required('token')
    def put(self, id):
        chap = Chapter.query.get(id)
        if not chap:
            return {"message" : "not found"}, 404
        data = request.get_json()
        if 1 == current_user.id:
            chap.name = data.get('name')
            chap.description = data.get('description')
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403
        
class ChapListAPI(Resource):
    @marshal_with(chap_fields)
    @auth_required('token')
    def get(self ):
        chap = Chapter.query.all()
        return chap
    
    @auth_required('token')
    def post(self):
        data = request.get_json()
        sub_id = data.get('sub_id')
        name = data.get('name')
        description = data.get('description')
        chap = Chapter(name = name, description = description,sub_id=sub_id)
        db.session.add(chap)
        db.session.commit()
        return jsonify({'message' : 'chapter created'})

class QuizApi(Resource):
    @marshal_with(quiz_fields)
    @auth_required('token')
    def get(self, id):
        try:    
            sub = Quiz.query.filter_by(chapter_id=id).all()
            if not sub:
                return {"message" : "this is not found"}, 404
            return sub
        except Exception as e:
            print(e)
            return 
        
    @marshal_with(quiz_fields)
    @auth_required('token')
    def post(self,id):
        try:
            data = request.get_json()
            duration=data.get('duration')
            doq= datetime.strptime(data.get('doq'), "%Y-%m-%d")
            sub = Quiz(chapter_id=id,doq=doq,duration=duration,remarks=data.get('remarks'))
            if not sub:
                return {"message" : "not found"}, 404
            db.session.add(sub)
            db.session.commit()
            return jsonify({'message' : 'chapter created'})
        except Exception as e:
            print(e)
            return jsonify({'message' : 'chapter created'}),405
    
    @marshal_with(quiz_fields)
    @auth_required('token')
    def delete(self, id):
        chap = Quiz.query.get(id)
        if not chap:
            return {"message" : "not found"}, 404
        
        if 1 == current_user.id:
            db.session.delete(chap)
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403
    
    @marshal_with(quiz_fields)
    @auth_required('token')
    def put(self, id):
        chap = Quiz.query.get(id)
        if not chap:
            return {"message" : "not found"}, 404
        data = request.get_json()
        if 1 == current_user.id:
            chap.duration=data.get('duration')
            chap.remarks=data.get('remarks')
            chap.doq= datetime.strptime(data.get('doq'), "%Y-%m-%d")
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403

class QApi(Resource):
    @marshal_with(q_fields)
    @auth_required('token')
    def get(self, id):
        try:    
            sub = Questions.query.filter_by(quiz_id=id).all()
            if not sub:
                return {"message" : "this is not found"}, 404
            return sub
        except Exception as e:
            print(e)
            return 
        
    @marshal_with(q_fields)
    @auth_required('token')
    def post(self,id):
        try:
            data = request.get_json()
            question=data.get('question')            
            opt1=data.get('opt1')            
            opt2=data.get('opt2')            
            opt3=data.get('opt3')            
            opt4=data.get('opt4')        
            answer= data.get('answer')    
            sub = Questions(quiz_id=id,question=question,opt1=opt1,opt2=opt2,opt3=opt3,opt4=opt4,answer=answer)
            if not sub:
                return {"message" : "not found"}, 404
            db.session.add(sub)
            db.session.commit()
            return jsonify({'message' : 'chapter created'})
        except Exception as e:
            print(e)
            return jsonify({'message' : 'chapter created'}),405
    
    @marshal_with(q_fields)
    @auth_required('token')
    def delete(self, id):
        chap = Questions.query.get(id)
        if not chap:
            return {"message" : "not found"}, 404
        
        if 1 == current_user.id:
            db.session.delete(chap)
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403
    
    @marshal_with(q_fields)
    @auth_required('token')
    def put(self, id):
        chap = Questions.query.get(id)
        if not chap:
            return {"message" : "not found"}, 404
        data = request.get_json()
        if 1 == current_user.id:
            chap.question=data.get('question')            
            chap.opt1=data.get('opt1')            
            chap.opt2=data.get('opt2')            
            chap.opt3=data.get('opt3')            
            chap.opt4=data.get('opt4')        
            chap.answer= data.get('answer') 
            db.session.commit()
        else:
            return {"message" : "not valid user"}, 403

class SubscribeApi(Resource):
    @auth_required('token')
    def get(self, user_id,sub_id):
        try:    
            sub = Subscribed.query.filter_by(user_id=user_id,sub_id=sub_id).first()
            if not sub:
                return {"message" : "not found"},404
            return {"message" : "found"},200
        except Exception as e:
            print(e)
            return 
    @auth_required('token')
    def put(self, user_id,sub_id):
        try:    
            sub = Subscribed.query.filter_by(user_id=user_id,sub_id=sub_id).first()
            if not sub:
                sub = Subscribed(user_id=user_id,sub_id=sub_id)
                db.session.add(sub)
            else:
                db.session.delete(sub)
            db.session.commit()
            return {"message" : "unsubscribed"}
        except Exception as e:
            print(e)
            return 

class ScoreApi(Resource):
    @auth_required('token')
    def put(self,quiz_id):
        try:
            data = request.get_json()
            sub = Scores(user_id=data.get("user_id"),quiz_id=quiz_id,score=data.get('score'))
            db.session.add(sub)
            db.session.commit()
            return {"message" : "recorded"}
        except Exception as e:
            print(e)
            return 

api.add_resource(SubAPI, '/subs/<int:sub_id>')
api.add_resource(SubListAPI,'/subs')
api.add_resource(ChapAPI, '/chaps/<int:id>')
api.add_resource(ChapListAPI,'/chaps')
api.add_resource(QuizApi,'/quiz/<int:id>')
api.add_resource(QApi,'/question/<int:id>')
api.add_resource(SubscribeApi,'/subscribe/<int:user_id>/<int:sub_id>')
api.add_resource(ScoreApi,'/score/<int:quiz_id>')
# api.add_resource(QuizListApi, '/quiz')