from django import forms

from .models import SeasonStage, StageBet, Coefficient, Match


class SeasonStageForm(forms.ModelForm):
    class Meta:
        model = SeasonStage
        fields = ['stage_season', 'stage_name', "is_current"]


class StageBetForm(forms.ModelForm):
    class Meta:
        model = StageBet
        fields = ["match_1", "match_2", "match_3", "must_be_checked"]


class CoefficientForm(forms.ModelForm):
    class Meta:
        model = Coefficient
        fields = ["home_coef", "draw_coef", "guest_coef", "match"]


class MatchForm(forms.ModelForm):
    class Meta:
        model = Match
        fields = ["stage", "preview", "home_goals", "guest_goals",
                  "home_team", "guest_team", "match_time", "match_type", "match_result",
                  "match_bonus", "match_name"]
