import json
import os

en_new = {
  "hero": {
    "eyebrow": "OEM Solutions",
    "title": "Development of a hub according to your specifications",
    "desc": "We don't just offer a catalog. VELNOX starts with analyzing the loads, operating environment, and functional requirements of your specific assembly."
  },
  "capabilities": {
    "title": "Customization Capabilities",
    "structural": {
      "title": "Structural Elements",
      "desc": "Adaptation of bearing unit geometry to limited space or specific mounting requirements."
    },
    "sealing": {
      "title": "Sealing Systems",
      "desc": "Selection of the optimal system (e.g., Dirtblock Seal or a combination of Plastic Cover with RS Seal) depending on the contamination level."
    },
    "resource": {
      "title": "Resource and Stability",
      "desc": "Optimization of materials to ensure repeatability of parameters in serial production, which is critical for the OEM market."
    }
  },
  "form": {
    "title": "Engineering Inquiry Form",
    "desc": "Provide technical parameters according to the VELNOX PL-127-G scheme.",
    "section_contacts": "Contacts",
    "section_tech": "Technical Parameters (PL-127-G)",
    "section_ops": "Operating Conditions",
    "name": "Full Name",
    "company": "Company / OEM Manufacturer",
    "position": "Position (Design Engineer, Procurement Manager, etc.)",
    "email": "Contact E-mail",
    "phone": "Phone Number",
    "d": "Bore diameter (d) or shaft diameter (mm)",
    "D": "Outer diameter (D, mm)",
    "BC": "Inner (B) and outer (C) ring width (mm)",
    "J": "Bolt circle diameter (J, mm)",
    "GHT": "Thread size and type (G / H/T)",
    "L": "Total length (L, mm)",
    "loads": "Dynamic (C dyn) and Static (Co) Loads (kN)",
    "rpm": "Rotational Speed (RPM)",
    "environment": "Operating Environment (dry dust, liquid fertilizers, impacts, etc.)",
    "resource": "Expected Resource (hours)",
    "submit": "Submit Inquiry",
    "success": "Your inquiry has been submitted. Our engineering department will analyze it and provide a preliminary response soon.",
    "success_email": "Automatic confirmation sent to email."
  }
}

uk_new = {
  "hero": {
    "eyebrow": "OEM Рішення",
    "title": "Розробка вузла за вашим ТЗ",
    "desc": "Ми не просто пропонуємо каталог. VELNOX починає роботу з аналізу навантажень, середовища роботи та функціональних вимог вашого конкретного вузла."
  },
  "capabilities": {
    "title": "Можливості кастомізації",
    "structural": {
      "title": "Конструктивні елементи",
      "desc": "Адаптація геометрії підшипникового вузла під обмежений простір або специфічне кріплення."
    },
    "sealing": {
      "title": "Системи ущільнень",
      "desc": "Вибір оптимальної системи (наприклад, Dirtblock Seal або поєднання Plastic Cover з RS Seal) залежно від рівня забруднення."
    },
    "resource": {
      "title": "Ресурс та стабільність",
      "desc": "Оптимізація матеріалів для забезпечення повторюваності параметрів у серійному виробництві, що критично для OEM-ринку."
    }
  },
  "form": {
    "title": "Інженерна форма запиту",
    "desc": "Вкажіть технічні параметри згідно зі схемою позначень VELNOX PL-127-G.",
    "section_contacts": "Контакти",
    "section_tech": "Технічні параметри (схема PL-127-G)",
    "section_ops": "Умови експлуатації",
    "name": "Прізвище та Ім'я",
    "company": "Назва компанії / OEM-виробника",
    "position": "Посада (Інженер-конструктор, Керівник відділу тощо)",
    "email": "Контактний E-mail",
    "phone": "Номер телефону",
    "d": "Внутрішній діаметр (d) або діаметр вала (мм)",
    "D": "Зовнішній діаметр (D, мм)",
    "BC": "Ширина внутрішнього кільця (B) та зовнішнього кільця (C, мм)",
    "J": "Діаметр центрів кріпильних отворів (J, мм)",
    "GHT": "Розмір та тип різьблення (G / H/T)",
    "L": "Загальна довжина вузла (L, мм)",
    "loads": "Динамічне (C dyn) та Статичне (Co) навантаження (kN)",
    "rpm": "Швидкість обертання (RPM)",
    "environment": "Робоче середовище (сухий пил, добрива, ударні навантаження)",
    "resource": "Очікуваний ресурс (мотогодини)",
    "submit": "Відправити запит",
    "success": "Ваш запит надіслано. Інженерний відділ опрацює його та зв'яжеться з вами найближчим часом.",
    "success_email": "Автоматичне підтвердження надіслано на пошту."
  }
}

directory = '/Users/localmac/Desktop/Велнокс/velnox-frontend/messages'

for lang in ['en', 'pl', 'uk']:
    try:
        file_path = os.path.join(directory, f"{lang}.json")
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        data['oemPage'] = uk_new if lang == 'uk' else en_new
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Updated {lang}.json")
    except Exception as e:
        print(f"Error updating {lang}: {e}")
