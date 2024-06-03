# Generated by Django 5.0.6 on 2024-06-01 09:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Connection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='connections1', to=settings.AUTH_USER_MODEL)),
                ('user2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='connections2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='userprofile',
            name='connections',
            field=models.ManyToManyField(related_name='connected_to', through='api.Connection', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='ConnectionRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_requests', to=settings.AUTH_USER_MODEL)),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BlockedUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('blocked_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocked', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocker', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'indexes': [models.Index(fields=['user'], name='api_blocked_user_id_fd0028_idx'), models.Index(fields=['blocked_user'], name='api_blocked_blocked_4c7392_idx')],
                'unique_together': {('user', 'blocked_user')},
            },
        ),
        migrations.AddIndex(
            model_name='connection',
            index=models.Index(fields=['user1'], name='api_connect_user1_i_de9ca7_idx'),
        ),
        migrations.AddIndex(
            model_name='connection',
            index=models.Index(fields=['user2'], name='api_connect_user2_i_72871c_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='connection',
            unique_together={('user1', 'user2')},
        ),
        migrations.AddIndex(
            model_name='connectionrequest',
            index=models.Index(fields=['from_user'], name='api_connect_from_us_883ed5_idx'),
        ),
        migrations.AddIndex(
            model_name='connectionrequest',
            index=models.Index(fields=['to_user'], name='api_connect_to_user_eceb73_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='connectionrequest',
            unique_together={('from_user', 'to_user')},
        ),
    ]
