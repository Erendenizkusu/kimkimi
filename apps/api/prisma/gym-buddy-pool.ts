import { QuestionType } from '@prisma/client';

import type { TypedQuestionPair } from './sevgili-pool';

export const GYM_BUDDY_TYPED_PAIRS: TypedQuestionPair[] = [
  {
    profile: 'Bench press PR’ın kaç?',
    game: 'Arkadaşının bench press PR’ı kaçtır?',
    type: QuestionType.text,
  },
  {
    profile: 'Squat PR’ın kaç?',
    game: 'Arkadaşının squat PR’ı kaçtır?',
    type: QuestionType.text,
  },
  {
    profile: 'Deadlift PR’ın kaç?',
    game: 'Arkadaşının deadlift PR’ı kaçtır?',
    type: QuestionType.text,
  },
  {
    profile: 'Yapmayı en sevdiğin hareket nedir?',
    game: 'Yapmayı en sevdiği hareket nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Yapmayı en sevmediğin hareket nedir?',
    game: 'Yapmayı en sevmediği hareket nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin compound hareket hangisidir?',
    game: 'En sevdiği compound hareket hangisidir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin izolasyon hareketi hangisidir?',
    game: 'En sevdiği izolasyon hareketi hangisidir?',
    type: QuestionType.text,
  },
  {
    profile: 'En güçlü olduğun bölge neresi?',
    game: 'En güçlü olduğu bölge neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'En zayıf bulduğun bölge neresi?',
    game: 'En zayıf bulduğu bölge neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çalışmayı en sevdiğin bölge neresi?',
    game: 'Çalışmayı en sevdiği bölge neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çalışmayı en sevmediğin bölge neresi?',
    game: 'Çalışmayı en sevmediği bölge neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'Haftada kaç gün spor yaparsın?',
    game: 'Haftada kaç gün spor yapar?',
    type: QuestionType.text,
  },
  {
    profile: 'Antrenman öncesi pre-workout mu tercih edersin, kahve mi?',
    game: 'Antrenman öncesi pre-workout mu tercih eder kahve mi?',
    type: QuestionType.single_choice,
    choices: ['Pre-workout', 'Kahve', 'İkisi de', 'Hiçbiri / nötr'],
  },
  {
    profile: 'Sabah mı antrenman yapmayı seversin, akşam mı?',
    game: 'Sabah mı antrenman yapmayı sever, akşam mı?',
    type: QuestionType.single_choice,
    choices: ['Sabah', 'Akşam', 'Gün ortası / fark etmez'],
  },
  {
    profile: 'En kalabalık saatte mi gidersin, daha sakin saatte mi?',
    game: 'En kalabalık saatte mi gider, daha sakin saatte mi?',
    type: QuestionType.single_choice,
    choices: ['Kalabalık saat', 'Sakin saat', 'Fark etmez'],
  },
  {
    profile: 'Cardio yapmayı sever misin?',
    game: 'Cardio yapmayı sever mi?',
    type: QuestionType.single_choice,
    choices: ['Evet sever', 'Pek sevmez', 'Ara sıra / idare eder'],
  },
  {
    profile: 'Leg day’i sever misin, nefret mi edersin?',
    game: 'Leg day’i sever mi, nefret mi eder?',
    type: QuestionType.single_choice,
    choices: ['Sever', 'Nefret eder', 'Normal / karışık'],
  },
  {
    profile: 'Hangi antrenman türünü tercih edersin?',
    game: 'Hangi antrenman türünü tercih eder?',
    type: QuestionType.single_choice,
    choices: ['Push-pull-legs', 'Upper-lower (üst-alt split)', 'Full body', 'Diğer'],
  },
  {
    profile: 'Spora kaç yaşında başladın?',
    game: 'Spora kaç yaşında başladı?',
    type: QuestionType.text,
  },
  {
    profile: 'Kalori sayar mısın?',
    game: 'Kalori sayar mı?',
    type: QuestionType.single_choice,
    choices: ['Evet', 'Hayır', 'Ara sıra'],
  },
  {
    profile: 'İlk başladığında amacın kilo vermek miydi, kas yapmak mıydı?',
    game: 'İlk başladığında amacı kilo vermek miydi, kas yapmak mıydı?',
    type: QuestionType.single_choice,
    choices: ['Kilo vermek', 'Kas yapmak', 'Karışık / ikisi'],
  },
  {
    profile: 'En sevdiğin supplement nedir?',
    game: 'En sevdiği supplement nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sık kullandığın supplement hangisidir?',
    game: 'En sık kullandığı supplement hangisidir?',
    type: QuestionType.text,
  },
  {
    profile: 'Antrenman öncesi kahve olmazsa olmazın mıdır?',
    game: 'Antrenman öncesi kahve olmazsa olmazı mıdır?',
    type: QuestionType.single_choice,
    choices: ['Evet olmazsa olmaz', 'Hayır şart değil', 'Bazen'],
  },
  {
    profile: 'Bulk yapmayı mı seversin, definasyona girmeyi mi?',
    game: 'Bulk yapmayı mı sever, definasyona girmeyi mi?',
    type: QuestionType.single_choice,
    choices: ['Bulk', 'Definasyon / cut', 'İkisi dengeli / maintenance'],
  },
  {
    profile: 'Diyette seni en çok zorlayan yiyecek hangisi?',
    game: 'Diyette onu en zorlayan yiyecek nedir?',
    type: QuestionType.single_choice,
    choices: ['Tatlılar', 'Ekmek / hamur işi', 'Fast food', 'Pizza / burger', 'Başka'],
  },
  {
    profile: 'Kulaklıkla mı çalışırsın, müziksiz mi?',
    game: 'Kulaklıkla mı çalışır, müziksiz mi?',
    type: QuestionType.single_choice,
    choices: ['Kulaklıkla', 'Müziksiz', 'Salon müziği yeter'],
  },
  {
    profile: 'Set aralarında telefonu çok kurcalar mısın?',
    game: 'Set aralarında telefonu çok kurcalar mı?',
    type: QuestionType.single_choice,
    choices: ['Çok kurcalar', 'Az', 'Neredeyse hiç'],
  },
  {
    profile: 'Stretching / ısınma yapar mısın?',
    game: 'Stretching/Isınma yapar mı?',
    type: QuestionType.single_choice,
    choices: ['Evet düzenli', 'Bazen', 'Hayır pek yapmaz'],
  },
  {
    profile: 'Serbest ağırlık mı seversin, makineler mi?',
    game: 'Serbest ağırlık mı sever, makineler mi?',
    type: QuestionType.single_choice,
    choices: ['Serbest ağırlık', 'Makineler', 'Karışık'],
  },
  {
    profile: 'Spotter ister misin, tek başına mı çalışmayı seversin?',
    game: 'Spotter ister mi, tek başına mı çalışmayı sever?',
    type: QuestionType.single_choice,
    choices: ['Spotter ister', 'Tek başına sever', 'Duruma göre'],
  },
  {
    profile: 'En çok hangi harekette formun bozulur?',
    game: 'En çok hangi harekette formu bozulur?',
    type: QuestionType.text,
  },
  {
    profile: 'En çok hangi konuda takıntılısın?',
    game: 'En çok hangi konuda takıntılıdır?',
    type: QuestionType.single_choice,
    choices: ['Kilo', 'Form', 'Pump', 'Aynadaki görüntü', 'Başka'],
  },
  {
    profile: 'Hedefin daha çok estetik mi, güç mü?',
    game: 'Sence hedefi daha çok estetik mi, güç mü?',
    type: QuestionType.single_choice,
    choices: ['Estetik', 'Güç', 'İkisi de'],
  },
  {
    profile: 'İlaç/kür kullanmadığını söylerken dürüst müsün?',
    game: 'Sence ilaç kullanmadığı konusunda dürüst mü?',
    type: QuestionType.single_choice,
    choices: ['Evet', 'Hayır', 'Steroidli pij'],
  },
  {
    profile: 'Salona daha çok gelişim için mi gidiyorsun, karşı cins için mi?',
    game: 'Salona karşı cins için mi gidiyor yoksa gelişim için mi?',
    type: QuestionType.single_choice,
    choices: ['Gelişim için', 'Karşı cins için', 'İkisi de'],
  },

  // ——— 2026-08 genişletme: salon kültürü & alışkanlık ———
  {
    profile: 'Antrenman listendeki bir numaralı şarkı hangisi?',
    game: 'Arkadaşının antrenman listesindeki bir numaralı şarkı hangisi?',
    type: QuestionType.text,
  },
  {
    profile: 'Kaçamak öğününde ne yersin?',
    game: 'Arkadaşın kaçamak öğününde ne yer?',
    type: QuestionType.text,
  },
  {
    profile: 'Günlük protein hedefin kaç gram?',
    game: 'Arkadaşının günlük protein hedefi kaç gram?',
    type: QuestionType.number,
  },
  {
    profile: 'Haftada kaç gün dinlenirsin?',
    game: 'Arkadaşın haftada kaç gün dinlenir?',
    type: QuestionType.number,
  },
  {
    profile: 'Aç karnına mı antrenman yaparsın, yemek yiyip mi?',
    game: 'Arkadaşın aç karnına mı antrenman yapar, yemek yiyip mi?',
    type: QuestionType.single_choice,
    choices: ['Aç karnına', 'Yemek yiyip', 'Fark etmez'],
  },
  {
    profile: 'Antrenmanda eldiven kullanır mısın?',
    game: 'Arkadaşın antrenmanda eldiven kullanır mı?',
    type: QuestionType.single_choice,
    choices: ['Kullanırım', 'Kullanmam', 'Bazen'],
  },
  {
    profile: 'Takip ettiğin bir spor içerik üreticisi var mı? Kim?',
    game: 'Arkadaşının takip ettiği spor içerik üreticisi kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Şu an hangi rekorun peşindesin?',
    game: 'Arkadaşın şu an hangi rekorun peşinde?',
    type: QuestionType.text,
  },
  {
    profile: 'Hiç sakatlandın mı? Neresi?',
    game: 'Arkadaşın hiç sakatlandı mı, neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'Antrenmandan sonra ilk ne yaparsın?',
    game: 'Arkadaşın antrenmandan sonra ilk ne yapar?',
    type: QuestionType.single_choice,
    choices: ['Protein içerim', 'Duş', 'Yemek', 'Uyurum', 'İşe / okula giderim'],
  },
  {
    profile: 'Salonda kiminle çalışmayı seversin?',
    game: 'Arkadaşın salonda kiminle çalışmayı sever?',
    type: QuestionType.single_choice,
    choices: ['Tek başıma', 'Partnerle', 'Grup dersinde', 'Antrenörle'],
  },
  {
    profile: 'Tatilde antrenmana devam eder misin?',
    game: 'Arkadaşın tatilde antrenmana devam eder mi?',
    type: QuestionType.single_choice,
    choices: ['Ederim', 'Etmem', 'Hafifletirim'],
  },
];
