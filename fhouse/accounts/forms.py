from django import forms
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout
)
from geohelp.models import Country, City

User = get_user_model()
NEW_COUNTRIES = (('a', 'ab'), ('c', 'cd'))
COUNTRY_CHOICES = (("AU", 'Австралия (Australia)'),
                   ("AT", 'Австрия (Österreich)'),
                   ("AZ", 'Азербайджан (Azərbaycan)'),
                   ("AX", 'Аландские о-ва (Åland)'),
                   ("AL", 'Албания (Shqipëri)'),
                   ("DZ", 'Алжир (Algeria)'),
                   ("AS", 'Американское Самоа (American Samoa)'),
                   ("AI", 'Ангилья (Anguilla)'),
                   ("AO", 'Ангола (Angola)'),
                   ("AD", 'Андорра (Andorra)'),
                   ("AQ", 'Антарктида (Antarctica)'),
                   ("AG", 'Антигуа и Барбуда (Antigua &amp; Barbuda)'),
                   ("AR", 'Аргентина (Argentina)'),
                   ("AM", 'Армения (Հայաստան)'),
                   ("AW", 'Аруба (Aruba)'),
                   ("AF", 'Афганистан (‫افغانستان‬‎)'),
                   ("BS", 'Багамские о-ва (Bahamas)'),
                   ("BD", 'Бангладеш (বাংলাদেশ)'),
                   ("BB", 'Барбадос (Barbados)'),
                   ("BH", 'Бахрейн (‫البحرين‬‎)'),
                   ("BY", 'Беларусь'),
                   ("BZ", 'Белиз (Belize)'),
                   ("BE", 'Бельгия (Belgium)'),
                   ("BJ", 'Бенин (Bénin)'),
                   ("BM", 'Бермудские о-ва (Bermuda)'),
                   ("BG", 'Болгария (България)'),
                   ("BO", 'Боливия (Bolivia)'),
                   ("BQ", 'Бонэйр, Синт-Эстатиус и Саба (Caribbean Netherlands)'),
                   ("BA", 'Босния и Герцеговина (Босна и Херцеговина)'),
                   ("BW", 'Ботсвана (Botswana)'),
                   ("BR", 'Бразилия (Brasil)'),
                   ("IO", 'Британская территория в Индийском океане (British Indian Ocean Territory)'),
                   ("BN", 'Бруней-Даруссалам (Brunei)'),
                   ("BF", 'Буркина-Фасо (Burkina Faso)'),
                   ("BI", 'Бурунди (Uburundi)'),
                   ("BT", 'Бутан (འབྲུག)'),
                   ("VU", 'Вануату (Vanuatu)'),
                   ("VA", 'Ватикан (Città del Vaticano)'),
                   ("GB", 'Великобритания (United Kingdom)'),
                   ("HU", 'Венгрия (Magyarország)'),
                   ("VE", 'Венесуэла (Venezuela)'),
                   ("VG", 'Виргинские о-ва (Британские) (British Virgin Islands)'),
                   ("VI", 'Виргинские о-ва (США) (U.S. Virgin Islands)'),
                   ("UM", 'Внешние малые о-ва (США) (U.S. Outlying Islands)'),
                   ("TL", 'Восточный Тимор (Timor-Leste)'),
                   ("VN", 'Вьетнам (Việt Nam)'),
                   ("GA", 'Габон (Gabon)'),
                   ("HT", 'Гаити (Haiti)'),
                   ("GY", 'Гайана (Guyana)'),
                   ("GM", 'Гамбия (Gambia)'),
                   ("GH", 'Гана (Gaana)'),
                   ("GP", 'Гваделупа (Guadeloupe)'),
                   ("GT", 'Гватемала (Guatemala)'),
                   ("GN", 'Гвинея (Guinée)'),
                   ("GW", 'Гвинея-Бисау (Guiné-Bissau)'),
                   ("DE", 'Германия (Deutschland)'),
                   ("GG", 'Гернси (Guernsey)'),
                   ("GI", 'Гибралтар (Gibraltar)'),
                   ("HN", 'Гондурас (Honduras)'),
                   ("HK", 'Гонконг (香港)'),
                   ("GD", 'Гренада (Grenada)'),
                   ("GL", 'Гренландия (Kalaallit Nunaat)'),
                   ("GR", 'Греция (Ελλάδα)'),
                   ("GE", 'Грузия (საქართველო)'),
                   ("GU", 'Гуам (Guam)'),
                   ("DK", 'Дания (Danmark)'),
                   ("JE", 'Джерси (Jersey)'),
                   ("DJ", 'Джибути (Djibouti)'),
                   ("DG", 'Диего-Гарсия (Diego Garcia)'),
                   ("DM", 'Доминика (Dominica)'),
                   ("DO", 'Доминиканская Республика (República Dominicana)'),
                   ("EG", 'Египет (‫مصر‬‎)'),
                   ("ZM", 'Замбия (Zambia)'),
                   ("EH", 'Западная Сахара (‫الصحراء الغربية‬‎)'),
                   ("ZW", 'Зимбабве (Zimbabwe)'),
                   ("IL", 'Израиль (‫ישראל‬‎)'),
                   ("IN", 'Индия (भारत)'),
                   ("ID", 'Индонезия (Indonesia)'),
                   ("JO", 'Иордания (‫الأردن‬‎)'),
                   ("IQ", 'Ирак (‫العراق‬‎)'),
                   ("IR", 'Иран (‫ایران‬‎)'),
                   ("IE", 'Ирландия (Ireland)'),
                   ("IS", 'Исландия (Ísland)'),
                   ("ES", 'Испания (España)'),
                   ("IT", 'Италия (Italia)'),
                   ("YE", 'Йемен (‫اليمن‬‎)'),
                   ("CV", 'Кабо-Верде (Kabu Verdi)'),
                   ("KZ", 'Казахстан'),
                   ("KY", 'Каймановы о-ва (Cayman Islands)'),
                   ("KH", 'Камбоджа (កម្ពុជា)'),
                   ("CM", 'Камерун (Cameroun)'),
                   ("CA", 'Канада (Canada)'),
                   ("IC", 'Канарские о-ва (Canarias)'),
                   ("QA", 'Катар (‫قطر‬‎)'),
                   ("KE", 'Кения (Kenya)'),
                   ("CY", 'Кипр (Κύπρος)'),
                   ("KG", 'Киргизия (Кыргызстан)'),
                   ("KI", 'Кирибати (Kiribati)'),
                   ("CN", 'Китай (中国)'),
                   ("KP", 'КНДР (조선민주주의인민공화국)'),
                   ("CC", 'Кокосовые о-ва (Kepulauan Cocos (Keeling))'),
                   ("CO", 'Колумбия (Colombia)'),
                   ("KM", 'Коморские о-ва (‫جزر القمر‬‎)'),
                   ("CG", 'Конго - Браззавиль (Congo-Brazzaville)'),
                   ("CD", 'Конго - Киншаса (Jamhuri ya Kidemokrasia ya Kongo)'),
                   ("XK", 'Косово (Kosovë)'),
                   ("CR", 'Коста-Рика (Costa Rica)'),
                   ("CI", 'Кот-д’Ивуар (Côte d’Ivoire)'),
                   ("CU", 'Куба (Cuba)'),
                   ("KW", 'Кувейт (‫الكويت‬‎)'),
                   ("CW", 'Кюрасао (Curaçao)'),
                   ("LA", 'Лаос (ລາວ)'),
                   ("LV", 'Латвия (Latvija)'),
                   ("LS", 'Лесото (Lesotho)'),
                   ("LR", 'Либерия (Liberia)'),
                   ("LB", 'Ливан (‫لبنان‬‎)'),
                   ("LY", 'Ливия (‫ليبيا‬‎)'),
                   ("LT", 'Литва (Lietuva)'),
                   ("LI", 'Лихтенштейн (Liechtenstein)'),
                   ("LU", 'Люксембург (Luxembourg)'),
                   ("MU", 'Маврикий (Moris)'),
                   ("MR", 'Мавритания (‫موريتانيا‬‎)'),
                   ("MG", 'Мадагаскар (Madagasikara)'),
                   ("YT", 'Майотта (Mayotte)'),
                   ("MO", 'Макао (澳門)'),
                   ("MK", 'Македония (Македонија)'),
                   ("MW", 'Малави (Malawi)'),
                   ("MY", 'Малайзия (Malaysia)'),
                   ("ML", 'Мали (Mali)'),
                   ("MV", 'Мальдивы (Maldives)'),
                   ("MT", 'Мальта (Malta)'),
                   ("MA", 'Марокко (Morocco)'),
                   ("MQ", 'Мартиника (Martinique)'),
                   ("MH", 'Маршалловы о-ва (Marshall Islands)'),
                   ("MX", 'Мексика (México)'),
                   ("MZ", 'Мозамбик (Moçambique)'),
                   ("MD", 'Молдова (Republica Moldova)'),
                   ("MC", 'Монако (Monaco)'),
                   ("MN", 'Монголия (Монгол)'),
                   ("MS", 'Монтсеррат (Montserrat)'),
                   ("MM", 'Мьянма (Бирма) (မြန်မာ)'),
                   ("NA", 'Намибия (Namibië)'),
                   ("NR", 'Науру (Nauru)'),
                   ("NP", 'Непал (नेपाल)'),
                   ("NE", 'Нигер (Nijar)'),
                   ("NG", 'Нигерия (Nigeria)'),
                   ("NL", 'Нидерланды (Nederland)'),
                   ("NI", 'Никарагуа (Nicaragua)'),
                   ("NU", 'Ниуэ (Niue)'),
                   ("NZ", 'Новая Зеландия (New Zealand)'),
                   ("NC", 'Новая Каледония (Nouvelle-Calédonie)'),
                   ("NO", 'Норвегия (Norge)'),
                   ("AE", 'ОАЭ (‫الإمارات العربية المتحدة‬‎)'),
                   ("CK", 'о-ва Кука (Cook Islands)'),
                   ("TC", 'о-ва Тёркс и Кайкос (Turks &amp; Caicos Islands)'),
                   ("HM", 'о-ва Херд и Макдональд (Heard &amp; McDonald Islands)'),
                   ("BV", 'о-в Буве (Bouvet Island)'),
                   ("AC", 'о-в Вознесения (Ascension Island)'),
                   ("CP", 'о-в Клиппертон (Clipperton Island)'),
                   ("IM", 'о-в Мэн (Isle of Man)'),
                   ("NF", 'о-в Норфолк (Norfolk Island)'),
                   ("CX", 'о-в Рождества (Christmas Island)'),
                   ("SH", 'о-в Св. Елены (St. Helena)'),
                   ("OM", 'Оман (‫عُمان‬‎)'),
                   ("PN", 'острова Питкэрн (Pitcairn Islands)'),
                   ("PK", 'Пакистан (‫پاکستان‬‎)'),
                   ("PW", 'Палау (Palau)'),
                   ("PS", 'Палестина (‫فلسطين‬‎)'),
                   ("PA", 'Панама (Panamá)'),
                   ("PG", 'Папуа – Новая Гвинея (Papua New Guinea)'),
                   ("PY", 'Парагвай (Paraguay)'),
                   ("PE", 'Перу (Perú)'),
                   ("PL", 'Польша (Polska)'),
                   ("PT", 'Португалия (Portugal)'),
                   ("PR", 'Пуэрто-Рико (Puerto Rico)'),
                   ("KR", 'Республика Корея (대한민국)'),
                   ("RE", 'Реюньон (La Réunion)'),
                   ("RU", 'Россия'),
                   ("RW", 'Руанда (Rwanda)'),
                   ("RO", 'Румыния (România)'),
                   ("SV", 'Сальвадор (El Salvador)'),
                   ("WS", 'Самоа (Samoa)'),
                   ("SM", 'Сан-Марино (San Marino)'),
                   ("ST", 'Сан-Томе и Принсипи (São Tomé e Príncipe)'),
                   ("SA", 'Саудовская Аравия (‫المملكة العربية السعودية‬‎)'),
                   ("SZ", 'Свазиленд (Swaziland)'),
                   ("MP", 'Северные Марианские о-ва (Northern Mariana Islands)'),
                   ("SC", 'Сейшельские о-ва (Seychelles)'),
                   ("BL", 'Сен-Бартельми (Saint-Barthélemy)'),
                   ("SN", 'Сенегал (Senegal)'),
                   ("MF", 'Сен-Мартен (Saint-Martin)'),
                   ("PM", 'Сен-Пьер и Микелон (Saint-Pierre-et-Miquelon)'),
                   ("VC", 'Сент-Винсент и Гренадины (St. Vincent &amp; Grenadines)'),
                   ("KN", 'Сент-Китс и Невис (St. Kitts &amp; Nevis)'),
                   ("LC", 'Сент-Люсия (St. Lucia)'),
                   ("RS", 'Сербия (Србија)'),
                   ("EA", 'Сеута и Мелилья (Ceuta y Melilla)'),
                   ("SG", 'Сингапур (Singapore)'),
                   ("SX", 'Синт-Мартен (Sint Maarten)'),
                   ("SY", 'Сирия (‫سوريا‬‎)'),
                   ("SK", 'Словакия (Slovensko)'),
                   ("SI", 'Словения (Slovenija)'),
                   ("US", 'Соединенные Штаты (United States)'),
                   ("SB", 'Соломоновы о-ва (Solomon Islands)'),
                   ("SO", 'Сомали (Soomaaliya)'),
                   ("SD", 'Судан (‫السودان‬‎)'),
                   ("SR", 'Суринам (Suriname)'),
                   ("SL", 'Сьерра-Леоне (Sierra Leone)'),
                   ("TJ", 'Таджикистан (Tajikistan)'),
                   ("TH", 'Таиланд (ไทย)'),
                   ("TW", 'Тайвань (台灣)'),
                   ("TZ", 'Танзания (Tanzania)'),
                   ("TG", 'Того (Togo)'),
                   ("TK", 'Токелау (Tokelau)'),
                   ("TO", 'Тонга (Tonga)'),
                   ("TT", 'Тринидад и Тобаго (Trinidad &amp; Tobago)'),
                   ("TA", 'Тристан-да-Кунья (Tristan da Cunha)'),
                   ("TV", 'Тувалу (Tuvalu)'),
                   ("TN", 'Тунис (Tunisia)'),
                   ("TM", 'Туркменистан (Turkmenistan)'),
                   ("TR", 'Турция (Türkiye)'),
                   ("UG", 'Уганда (Uganda)'),
                   ("UZ", 'Узбекистан (Oʻzbekiston)'),
                   ("UA", 'Украина (Україна)'),
                   ("WF", 'Уоллис и Футуна (Wallis &amp; Futuna)'),
                   ("UY", 'Уругвай (Uruguay)'),
                   ("FO", 'Фарерские о-ва (Føroyar)'),
                   ("FM", 'Федеративные Штаты Микронезии (Micronesia)'),
                   ("FJ", 'Фиджи (Fiji)'),
                   ("PH", 'Филиппины (Philippines)'),
                   ("FI", 'Финляндия (Suomi)'),
                   ("FK", 'Фолклендские о-ва (Falkland Islands (Islas Malvinas))'),
                   ("FR", 'Франция (France)'),
                   ("GF", 'Французская Гвиана (Guyane française)'),
                   ("PF", 'Французская Полинезия (Polynésie française)'),
                   ("TF", 'Французские Южные Территории (Terres australes françaises)'),
                   ("HR", 'Хорватия (Hrvatska)'),
                   ("CF", 'ЦАР (République centrafricaine)'),
                   ("TD", 'Чад (Tchad)'),
                   ("ME", 'Черногория (Crna Gora)'),
                   ("CZ", 'Чехия (Česká republika)'),
                   ("CL", 'Чили (Chile)'),
                   ("CH", 'Швейцария (Schweiz)'),
                   ("SE", 'Швеция (Sverige)'),
                   ("SJ", 'Шпицберген и Ян-Майен (Svalbard og Jan Mayen)'),
                   ("LK", 'Шри-Ланка (ශ්‍රී ලංකාව)'),
                   ("EC", 'Эквадор (Ecuador)'),
                   ("GQ", 'Экваториальная Гвинея (Guinea Ecuatorial)'),
                   ("ER", 'Эритрея (Eritrea)'),
                   ("EE", 'Эстония (Eesti)'),
                   ("ET", 'Эфиопия (Ethiopia)'),
                   ("ZA", 'ЮАР (South Africa)'),
                   ("GS", 'Южная Георгия и Южные Сандвичевы о-ва (South Georgia &amp; South Sandwich Islands)'),
                   ("SS", 'Южный Судан (‫جنوب السودان‬‎)'),
                   ("JM", 'Ямайка (Jamaica)'),
                   ("JP", 'Япония (日本)'))


class UserLoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self, *args, **kwargs):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        # user_qs = User.objects.filter(username=username)
        # if user_qs.count() == 1:
        #     user = user_qs.first()
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise forms.ValidationError('This user does not exist.')

            if not user.check_password(password):
                raise forms.ValidationError('Incorrect password.')

            if not user.is_active:
                raise forms.ValidationError('This user is not longer active.')

        return super(UserLoginForm, self).clean(*args, **kwargs)


class UserRegisterForm(forms.ModelForm):
    first_name = forms.CharField(label='First name', widget=forms.TextInput(attrs={'placeholder': 'Имя', 'maxlength':'12'}))
    last_name = forms.CharField(label='Last name', widget=forms.TextInput(attrs={'placeholder': 'Фамилия', 'maxlength':'12'}))
    email = forms.EmailField(label='Email address', widget=forms.TextInput(attrs={'placeholder': 'Email адресс'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Пароль', 'maxlength':'30'}))
    country = forms.CharField(label='Country', widget=forms.Select(choices=COUNTRY_CHOICES))
    city = forms.CharField(label='City', widget=forms.TextInput(attrs={'placeholder': 'Город', 'maxlength':'20'}))
    avatar = forms.ImageField()
    date_of_birth = forms.DateField()

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            # 'email2',
            'password',
            'country',
            'city',
            'avatar',
            'date_of_birth',
        ]

    # def clean(self, *args, **kwargs):
    #     email = self.cleaned_data.get('email')
    #     email2 = self.cleaned_data.get('email2')
    #     if email != email2:
    #         raise forms.ValidationError('Emails must match')
    #
    #     email_qs = User.objects.filter(email=email)
    #     if email_qs.exists():
    #         raise forms.ValidationError('This email has already been registered.')
    #     return super(UserRegisterForm, self).clean(*args, **kwargs)

    def clean_city(self):
        city = self.cleaned_data.get('city')
        # country_name = self.cleaned_data.get('country')
        country_obj = self.clean_country()
        city_set = City.objects.filter(name=city, country=country_obj)
        if len(city_set) > 0:
            return city_set.first()
        else:
            new_city = City(country=country_obj, name=city)
            new_city.save()
            return new_city

    def clean_country(self):
        country = self.cleaned_data.get('country')
        country_set = Country.objects.filter(name=country)
        print(country_set)
        if len(country_set) > 0:
            return country_set.first()
        else:
            new_country = Country(name=country)
            new_country.save()
            return new_country

            # def clean_email2(self):
            #     email = self.cleaned_data.get('email')
            #     email2 = self.cleaned_data.get('email2')
            #     if email != email2:
            #         raise forms.ValidationError('Emails must match')
            #
            #     email_qs = User.objects.filter(email=email)
            #     if email_qs.exists():
            #         raise forms.ValidationError('This email has already been registered.')
            #
            #     return email
