from rest_framework import serializers
from api.models import *    
 
 
class UserSerializer(serializers.ModelSerializer): 
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        
    def create(self, validated_data):
        password=validated_data.pop('password',None)
        instance=self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()    
        return instance     
        
class ThoughtsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thoughts
        fields = '__all__'