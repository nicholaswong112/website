from django import forms
from .models import Comment

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Submit

class CommentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CommentForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.layout = Layout(
            Field('name'),
            Field('comment', rows=3),
            Submit('post', 'Post')
        )

    class Meta:
        model = Comment
        fields = ('name', 'comment')