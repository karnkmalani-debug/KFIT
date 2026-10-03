// KFit Nutrition Coach -- lesson content (all habits, the 7-day Reset and the plans).
// General eating coaching: everyday foods from any kitchen, with Indian dishes as one
// choice among many. Pure content: the app and Merge load it via <script src>.
// Each habit ~14 days: a short read, one small action, a one-tap check-in
// (Done / Partly / Not today). Days 7 and 14 are reflections; day 14 decides.

const KFIT_CHECKIN_OPTIONS = [
  {
    "id": "done",
    "label": "Done"
  },
  {
    "id": "partly",
    "label": "Partly"
  },
  {
    "id": "not",
    "label": "Not today"
  }
];

const KFIT_HABITS = [
  {
    "id": "start",
    "n": 0,
    "title": "Start here",
    "short": "How this works",
    "checkin": null,
    "days": [
      {
        "title": "Welcome. Take a breath.",
        "read": [
          "You don't need to fix everything. You never did.",
          "Most eating plans ask you to change ten things on Monday. By Thursday, life happens, and it all falls apart. That isn't a willpower problem. It's a design problem.",
          "So we'll do it differently. One habit at a time. Each one gets about two weeks, long enough to feel easy, short enough to stay interesting.",
          "Every day you'll get a short read like this one, one small thing to try, and a single tap to say how it went. That's it. No weighing food, and no foods you're never allowed to eat again. The app keeps a rough calorie estimate in the background, just for reference. Your habits are what matter.",
          "Some days will go well. Some won't. Both are part of it. What matters isn't a perfect week. It's that you keep coming back."
        ],
        "action": "Put this app on your home screen, where you'll see it tomorrow.",
        "type": "lesson"
      },
      {
        "title": "Your hands are your measuring cups",
        "read": [
          "Numbers are hard to live with. Grams, calories, macros: they work on paper and fall apart at a wedding buffet.",
          "Your hands come with you everywhere. They're also sized to you: bigger person, bigger hands, bigger portions.",
          "Palm (the size and thickness of your palm): protein. Chicken, fish, eggs, tofu, paneer, Greek yogurt.",
          "Fist: vegetables. Salad, cooked greens, stir-fried vegetables, soup.",
          "Cupped hand: carbs. Rice, pasta, bread or roti, potatoes, fruit.",
          "Thumb: fats. Olive oil, butter or ghee, nuts, seeds, avocado.",
          "These are starting points, not rules. Later, you'll learn to nudge them up or down based on how you feel and what's changing. For now, just get to know them."
        ],
        "action": "At your next meal, hold your palm next to your plate. Just notice.",
        "type": "lesson"
      },
      {
        "title": "Where you are today",
        "read": [
          "Before we start, it helps to know where \"start\" is.",
          "This isn't a test and there's nothing to pass. It's a bookmark, so that in a few months you can look back and see how far you've come. Change is slow enough that we forget where we began.",
          "If you'd like, take one photo in comfortable clothes and one waist measurement at your belly button. Both are optional. You can skip this and still do everything else.",
          "One more thing: if you have a medical condition, like kidney disease, diabetes on medication, or anything your doctor watches closely, check with them before changing how much protein you eat. Tomorrow, that's where we begin."
        ],
        "action": "Optional: add a starting photo or waist measurement.",
        "type": "lesson"
      }
    ]
  },
  {
    "id": "protein-first",
    "n": 1,
    "title": "Protein First",
    "short": "A palm of protein at every main meal",
    "checkin": "Did you have a palm of protein at each main meal today?",
    "explainer": {
      "title": "Protein First, in two minutes",
      "scenes": [
        {
          "visual": "A typical plate: a big mound of pasta or rice, bread on the side, a small piece of protein at the edge.",
          "line": "Look at a typical plate. Rice, pasta or bread in the middle. Protein, if it's there, is a small side at the edge."
        },
        {
          "visual": "Same plate, a soft glow around the rice.",
          "line": "There's nothing wrong with rice, pasta or bread. But when the carb is the centre, hunger tends to come back fast."
        },
        {
          "visual": "Simple clock, hands moving from 1pm to 3pm, a biscuit packet appears.",
          "line": "An hour or two later, energy dips. The biscuits start calling. Most people blame willpower. It's usually the plate."
        },
        {
          "visual": "An open palm, gently outlined.",
          "line": "Protein First is one simple shift: before anything else, make sure there's a palm of protein on the plate."
        },
        {
          "visual": "Row of icons: 2 eggs, a chicken breast, a fish fillet, a bowl of Greek yogurt, a block of tofu.",
          "line": "Two eggs. A chicken breast or a fish fillet. A block of tofu or paneer. A bowl of Greek yogurt. That's a palm."
        },
        {
          "visual": "A bowl of lentils or beans labelled \"about half a palm\", next to a piece of chicken.",
          "line": "Beans and lentils are good foods, but they're mostly carbs. A bowl is about half a palm, so give it a partner."
        },
        {
          "visual": "Person at 40+, climbing stairs easily; a small muscle icon.",
          "line": "Protein keeps you full longer, steadies your energy, and helps you keep muscle as you get older."
        },
        {
          "visual": "The new plate: chicken, fish or tofu first, vegetables, a smaller portion of rice or bread.",
          "line": "You don't have to remove anything. Just let protein claim its space first, and fit the rest around it."
        },
        {
          "visual": "Three check-in buttons: Done, Partly, Not today.",
          "line": "For two weeks, that's your only job. A palm at each main meal. Some days you'll miss. That's fine. Just aim for the next one."
        }
      ]
    },
    "days": [
      {
        "title": "Why protein comes first",
        "read": [
          "If you only change one thing about how you eat, make it this.",
          "Protein keeps you full for longer. It helps you hold on to muscle as you get older, and after 35 that matters more every year. It also steadies your energy, so the 4pm biscuit craving gets quieter.",
          "Many everyday meals are built around the carb: pasta, rice, sandwiches, cereal, roti. Nothing wrong with those. But protein usually shows up as a small side, if at all.",
          "So we flip it. Protein claims its space on the plate first. Everything else fits around it.",
          "Your habit for the next two weeks: a palm of protein at every main meal. Breakfast, lunch, dinner. That's all."
        ],
        "action": "Look at your next meal and find the protein. Is there a palm of it?",
        "type": "lesson"
      },
      {
        "title": "What counts as a palm",
        "read": [
          "A palm is roughly the size and thickness of your palm, without fingers. Here's what one looks like in everyday food:",
          "2 eggs. A chicken breast or a fillet of fish. A block of tofu or paneer. A bowl of Greek yogurt or cottage cheese. A lean steak or a few slices of turkey.",
          "Some foods have protein but aren't mostly protein. Beans, lentils, chickpeas and milk are good foods, but they bring a lot of carbs along. A bowl of lentils or dal is closer to half a palm.",
          "That doesn't make them wrong. It just means they usually need a partner: lentil soup with a side of eggs, beans with chicken, dal with paneer or yogurt.",
          "Don't worry about being exact. Close is good enough."
        ],
        "action": "Find three palm-sized proteins in your kitchen right now.",
        "type": "lesson"
      },
      {
        "title": "Breakfast is the tricky one",
        "read": [
          "Lunch and dinner often have some protein already. Breakfast usually doesn't.",
          "Cereal, toast, a pastry with coffee, oats with just milk: mostly carbs, almost no protein. Then by 11am you're hungry again, and it isn't your fault.",
          "You don't have to give up your breakfast. Just add to it.",
          "Toast, plus 2 eggs. Greek yogurt with fruit and a few nuts. A vegetable omelette. Cottage cheese with fruit. Or, if you like Indian breakfasts, poha or upma with a bowl of yogurt or eggs on the side.",
          "Add first. Take away later, only if you want to."
        ],
        "action": "Plan tomorrow's breakfast protein tonight.",
        "type": "lesson"
      },
      {
        "title": "Vegetarian? You're not stuck",
        "read": [
          "Getting enough protein as a vegetarian takes a little more thought, but it's very doable.",
          "Your strongest options: Greek yogurt, cottage cheese, tofu, tempeh, paneer, eggs if you eat them, and a protein powder if it helps. These are protein-rich without too many extra carbs.",
          "Your supporting options: lentils, beans, chickpeas, edamame, milk and roasted chickpeas. They add up, especially when two of them share a plate.",
          "A good trick is to pair one strong option with one supporting one. Tofu stir-fry with edamame. Greek yogurt with a bean salad. Paneer with dal.",
          "If a protein powder makes your day easier, that's fine too. It's food, not a shortcut."
        ],
        "action": "Pick one strong vegetarian protein to buy this week.",
        "type": "lesson"
      },
      {
        "title": "Keep it ready",
        "read": [
          "Most missed protein isn't a choice. It's a busy evening and an empty fridge.",
          "The fix is to make the easy option the protein option.",
          "Boil 6 eggs on Sunday. Cook a batch of chicken or tofu. Keep Greek yogurt in the fridge. Keep roasted chickpeas or nuts in a jar on the counter.",
          "When protein is already there, you don't have to decide. You just reach for it."
        ],
        "action": "Prepare one ready-to-eat protein for the next two days.",
        "type": "lesson"
      },
      {
        "title": "On the days it doesn't happen",
        "read": [
          "At some point this week you'll miss a meal's protein. Maybe you already have.",
          "Here's the important part: that's normal, and it changes nothing.",
          "The goal was never seven perfect days. It's more meals with protein than before. If last week you had it once a day and this week twice, that's real progress.",
          "When you miss, don't make it up with a giant dinner, and don't write the day off. Just aim for the next meal.",
          "Missing a meal is one moment. Stopping is a decision. You only have to avoid the second one."
        ],
        "action": "If you missed one today, choose your next protein now.",
        "type": "lesson"
      },
      {
        "title": "Your first week",
        "read": [
          "One week in. Let's look back, gently.",
          "No grades here. Just notice what happened."
        ],
        "questions": [
          "Which meal was easiest to get protein into?",
          "Which meal was hardest, and why?",
          "Did you notice any change in hunger or energy?"
        ],
        "action": "Pick the one meal you'll focus on this coming week.",
        "type": "reflect"
      },
      {
        "title": "Lunch at work",
        "read": [
          "Lunch away from home is where good plans quietly disappear.",
          "If you pack lunch, build it around the protein: chicken, fish, eggs or tofu first, with rice, bread or pasta second.",
          "If you eat at a canteen or cafe, look for the eggs, chicken, fish or yogurt before the rest. Take those first.",
          "If you order in, most places have a protein-first option: grilled chicken, a salmon bowl, an omelette, a chicken or tofu salad.",
          "And keep a backup at your desk: roasted chickpeas, a protein bar, nuts. For the days nothing else works."
        ],
        "action": "Put one backup protein in your bag or desk.",
        "type": "lesson"
      },
      {
        "title": "Notice how you feel",
        "read": [
          "A few days of more protein often brings quiet changes. You may not have noticed them yet.",
          "Hunger between meals might be softer. Evening cravings might be a little quieter. You might feel less of a slump after lunch.",
          "Or maybe nothing yet, and that's fine too. Some things take longer.",
          "Paying attention is a skill in itself. Your body is always telling you something. We're just learning to listen."
        ],
        "action": "After lunch today, notice: how hungry are you two hours later?",
        "type": "lesson"
      },
      {
        "title": "Eating out",
        "read": [
          "Restaurants aren't the enemy. They just need a small plan.",
          "Look at the menu for the protein first, then build around it. Grilled chicken, fish, steak, egg dishes, tofu, kebabs or tikka.",
          "At a buffet, fill up on the protein and the salad before the bread, the rice and the fries.",
          "At a wedding or party, find the protein counter early, before the plate fills with everything else.",
          "One plate out of your routine won't undo anything. The habit carries on at the next meal."
        ],
        "action": "Next time you eat out, find the protein on the menu first.",
        "type": "lesson"
      },
      {
        "title": "Cooking for a family",
        "read": [
          "If you cook for others, or someone cooks for you, changing your plate can feel awkward.",
          "You don't need a separate meal. Just one extra bowl.",
          "Add one protein dish to the usual family meal: a tray of roast chicken, a bowl of eggs, grilled fish, a big bowl of yogurt. Keep it in the fridge for anyone who wants it.",
          "Often the family starts eating it too. Nobody has to call it a diet."
        ],
        "action": "Add one protein dish to a family meal this week.",
        "type": "lesson"
      },
      {
        "title": "When it starts to feel normal",
        "read": [
          "Somewhere around now, protein might stop feeling like a task. You just reach for it.",
          "That's what a habit is. Not something you remember to do, but something you'd feel odd skipping.",
          "If it isn't there yet, that's okay. Some habits take two weeks. Some take four. There's no race."
        ],
        "action": "Notice one meal today where you added protein without thinking.",
        "type": "lesson"
      },
      {
        "title": "The small wins count",
        "read": [
          "It's easy to only notice what's still left to fix.",
          "So today, notice what's already better. Maybe you have eggs at breakfast now. Maybe your 11am hunger is gone. Maybe you pack protein without thinking.",
          "These are real changes. Small changes, repeated, are how everything else gets built.",
          "Tomorrow you'll look back at these two weeks and decide what comes next."
        ],
        "action": "Write down one thing that feels easier than two weeks ago.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of Protein First",
        "read": [
          "You've spent two weeks on one habit. Let's see where it stands, honestly and kindly."
        ],
        "questions": [
          "On most days, did you get a palm of protein at each main meal?",
          "Does it feel mostly automatic now, or still like effort?",
          "What would make it easier?"
        ],
        "decision": {
          "moveOnText": "Protein First is part of your routine now. It stays with you as you add the next habit.",
          "stayText": "One more week with this habit is a good choice. Settled habits make the next ones easier."
        },
        "action": "Choose: move on to Habit 2, or stay one more week.",
        "type": "reflect"
      }
    ]
  },
  {
    "id": "fibre-second",
    "n": 2,
    "title": "Fibre second",
    "short": "A fist of vegetables at lunch and dinner",
    "checkin": "Did you have a fist of vegetables at lunch and dinner today?",
    "explainer": {
      "title": "Why vegetables come next",
      "scenes": [
        {
          "visual": "The protein-first plate from Habit 1, with an empty space beside the protein.",
          "line": "You've given protein its place. Now let's fill the space right next to it."
        },
        {
          "visual": "A closed fist beside a bowl of mixed vegetables.",
          "line": "Your next habit: a fist of vegetables at lunch and at dinner."
        },
        {
          "visual": "Vegetables drawn as a big, light pile next to a small dense biscuit.",
          "line": "Vegetables take up a lot of room for very little. They fill your plate, and your stomach, without weighing you down."
        },
        {
          "visual": "Simple gut illustration with a calm, happy expression.",
          "line": "The fibre in them keeps digestion moving and feeds the helpful bacteria in your gut."
        },
        {
          "visual": "A bowl of potatoes with a small label: \"counts as carbs\".",
          "line": "One note: potatoes and sweet corn are closer to carbs. They're fine to eat, but they don't count as your fist."
        },
        {
          "visual": "Row: broccoli, spinach, green beans, cabbage, peppers, a mixed salad, tomato soup.",
          "line": "Broccoli, spinach, green beans, cabbage, peppers, a big salad, a bowl of vegetable soup. These are your fists."
        },
        {
          "visual": "A creamy dish with few vegetables, beside a stir-fry full of vegetables.",
          "line": "Some dishes are more sauce than vegetable. Where you can, ask for more vegetables, less sauce."
        },
        {
          "visual": "Plate with a palm of protein and a fist of vegetables, then rice or bread.",
          "line": "Palm of protein. Fist of vegetables. Then everything else. Your plate is starting to take shape."
        },
        {
          "visual": "Check-in buttons.",
          "line": "Two weeks, one fist at lunch and dinner. Start with the vegetables you already like."
        }
      ]
    },
    "days": [
      {
        "title": "The space next to your protein",
        "read": [
          "Protein has its place on your plate now. Let's give it a neighbour.",
          "Vegetables do something nothing else does quite as well: they fill you up without filling you out. A plate with plenty of vegetables feels generous, and it is.",
          "They bring fibre, which keeps digestion steady. They bring vitamins and minerals your body quietly needs every day. And they slow the meal down, which gives your fullness signals time to arrive.",
          "Your habit for the next two weeks: a fist of vegetables at lunch and dinner.",
          "Protein First keeps going too. You're not swapping habits. You're stacking them."
        ],
        "action": "At lunch today, find the vegetables on your plate. Is there a fist?",
        "type": "lesson"
      },
      {
        "title": "What counts as a fist",
        "read": [
          "A fist is about the size of your closed fist. Here's what that looks like:",
          "A bowl of cooked greens, beans, broccoli, cauliflower or cabbage. A plate of salad. A bowl of vegetable soup. A big handful of roasted peppers or mushrooms. A cooked vegetable dish like a stir-fry.",
          "Some vegetables behave more like carbs: potato, sweet potato, sweet corn, and to a smaller degree peas. They're good foods. They just don't count as your fist.",
          "So a potato and cauliflower dish counts for the cauliflower, not the potato.",
          "Raw or cooked, fresh or frozen, all count. There's no wrong way to eat a vegetable."
        ],
        "action": "Name three vegetables you actually enjoy.",
        "type": "lesson"
      },
      {
        "title": "The gravy question",
        "read": [
          "Many dishes come swimming in sauce or gravy, with a few pieces of vegetable hiding inside.",
          "That's not a reason to avoid them. It's just worth knowing that a bowl of sauce isn't always a fist of vegetables.",
          "At home, you can tip the balance: more vegetables in the pot, a little less oil and masala base. The taste stays. The fist gets bigger.",
          "Outside, drier dishes usually carry more vegetables: roasted or grilled vegetables, a stir-fry, a big salad.",
          "Small nudges, not a new menu."
        ],
        "action": "Next time you cook or order, pick a drier, vegetable-heavy dish.",
        "type": "lesson"
      },
      {
        "title": "The easiest fist of all",
        "read": [
          "If cooking an extra vegetable dish sounds like work, start with a salad.",
          "A simple salad takes three minutes: chopped cucumber, tomato and onion, a squeeze of lemon, salt and pepper. Carrot and cucumber sticks take one.",
          "Put it on the table before the meal starts. Most people eat what's in front of them first.",
          "This also quietly prepares you for the habit that comes after this one."
        ],
        "action": "Make a quick salad for lunch or dinner today.",
        "type": "lesson"
      },
      {
        "title": "A bonus, not a rule",
        "read": [
          "Your habit covers lunch and dinner. Breakfast vegetables are a bonus.",
          "If you'd like to try: add spinach to your eggs. Stir peas, carrots or peppers into your breakfast. Put tomato and cucumber in your sandwich.",
          "If mornings are rushed, skip it. Doing two meals well beats trying three and feeling behind."
        ],
        "action": "Optional: add one vegetable to tomorrow's breakfast.",
        "type": "lesson"
      },
      {
        "title": "If you don't love vegetables",
        "read": [
          "Not everyone does. That's okay.",
          "Start with the ones you already like, even if it's only two or three. There's no prize for variety in week one.",
          "Change the way they're cooked. Roasted or grilled vegetables taste completely different from boiled ones. A little olive oil, garlic and your favourite spices go a long way.",
          "Hide them in things you enjoy: spinach in a sauce, vegetables in a wrap or an omelette, blended into a soup.",
          "Tastes change over time. Many people find they like more vegetables after a few weeks of eating them regularly."
        ],
        "action": "Try one vegetable cooked a new way this week.",
        "type": "lesson"
      },
      {
        "title": "One week of vegetables",
        "read": [
          "One week in. Let's look back.",
          "Remember, Protein First is still with you. How are both habits sitting together?"
        ],
        "questions": [
          "Was lunch or dinner easier for vegetables?",
          "Which vegetables showed up most?",
          "How is Protein First holding up alongside this?"
        ],
        "action": "Choose one meal to make your \"fist\" meal this week.",
        "type": "reflect"
      },
      {
        "title": "Where does fruit fit?",
        "read": [
          "Fruit is wonderful food. Fibre, vitamins, sweetness, and it comes in its own wrapper.",
          "But fruit behaves more like a carb than a vegetable. So a banana or a bowl of papaya counts as a cupped hand of carbs, not a fist of vegetables.",
          "Keep eating fruit. Just don't let it replace the vegetables at lunch and dinner.",
          "Whole fruit beats juice every time. The fibre stays, and it's much harder to overdo."
        ],
        "action": "Notice where fruit shows up in your day.",
        "type": "lesson"
      },
      {
        "title": "Quick and frozen",
        "read": [
          "Fresh vegetables are lovely. They're also a lot of chopping.",
          "Frozen peas, beans, mixed vegetables and corn are picked and frozen quickly, and they keep their goodness well. They're a perfectly good fist.",
          "Pre-cut vegetables from the market, ready-to-cook packs, and a bag of baby carrots all count.",
          "Make it easy enough that even a tired evening still gets a fist."
        ],
        "action": "Stock one quick vegetable option this week.",
        "type": "lesson"
      },
      {
        "title": "Your gut may notice",
        "read": [
          "If you've added a lot of vegetables quickly, your stomach may feel a little full or gassy at first.",
          "That's common, and it usually settles within a week or two as your gut adjusts.",
          "Go gradually if you need to. Cooked vegetables are gentler than raw. Drink water through the day.",
          "If discomfort is strong or doesn't settle, it's worth checking with your doctor."
        ],
        "action": "Drink a glass of water with each main meal today.",
        "type": "lesson"
      },
      {
        "title": "Vegetables when eating out",
        "read": [
          "Restaurant meals often come light on vegetables. A little planning fills the gap.",
          "Order one vegetable dish for the table: grilled vegetables, a side salad, steamed greens. Ask for extra salad on the side; most places will happily bring it.",
          "With takeaway, add a quick salad or some cucumber at home.",
          "Remember the order you've already learned: find your palm, then your fist."
        ],
        "action": "Next time you eat out, find one vegetable dish.",
        "type": "lesson"
      },
      {
        "title": "Palm and fist together",
        "read": [
          "This is what your plate is starting to look like: a palm of protein, a fist of vegetables, and then the rest.",
          "It isn't a diet. It's just a plate with its priorities in order.",
          "You'll notice that when the first two are there, you naturally want a little less of everything else. Not because you're holding back, but because you're satisfied."
        ],
        "action": "Build one meal today with a palm and a fist before anything else.",
        "type": "lesson"
      },
      {
        "title": "Look how far you've come",
        "read": [
          "Four weeks ago, you started with a single habit. Now there are two, working together.",
          "Maybe your plate looks different. Maybe your afternoons feel steadier. Maybe you just think about food a little more calmly.",
          "However big or small, that's real change. Tomorrow you'll decide what comes next."
        ],
        "action": "Write down one way your meals look different from a month ago.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of Fibre second",
        "read": [
          "Two weeks with vegetables. Let's see where things stand."
        ],
        "questions": [
          "On most days, did you have a fist of vegetables at lunch and dinner?",
          "Does it feel mostly automatic, or still like effort?",
          "Is Protein First still going strong?"
        ],
        "decision": {
          "moveOnText": "Vegetables have a place on your plate now. Next, we'll look at the order you eat things in.",
          "stayText": "Another week to settle this habit is a smart choice. There's no rush."
        },
        "action": "Choose: move on to Habit 3, or stay one more week.",
        "type": "reflect"
      }
    ]
  },
  {
    "id": "eating-order",
    "n": 3,
    "title": "Eating Order",
    "short": "Protein, then vegetables, then fats, carbs last",
    "checkin": "Did you eat your carbs last at your main meals today?",
    "explainer": {
      "title": "Same plate, different order",
      "scenes": [
        {
          "visual": "Two identical plates side by side: chicken, vegetables, a drizzle of olive oil, rice and bread.",
          "line": "Here are two identical plates. Same food, same amount. One small difference: the order it's eaten in."
        },
        {
          "visual": "Numbered sequence appears: 1 protein, 2 vegetables, 3 fats, 4 carbs.",
          "line": "Protein first. Vegetables next. Then fats. Carbs last."
        },
        {
          "visual": "Gentle wave line (steady) vs a sharp spike line (crash).",
          "line": "When carbs come at the end, the energy from the meal tends to arrive more gently. Fewer spikes, fewer crashes."
        },
        {
          "visual": "Person after lunch, alert at a desk, rather than slumped.",
          "line": "Many people notice steadier energy after meals, and less craving for something sweet later."
        },
        {
          "visual": "Stomach filling up with protein and vegetables first, smaller space left for rice or bread.",
          "line": "And when protein and vegetables arrive first, you often need a little less of the rest to feel full."
        },
        {
          "visual": "A sandwich, a wrap and a curry with bread: meals where everything comes together.",
          "line": "Some meals come all together: a sandwich, a wrap, a curry with bread. That's fine. We won't fight it."
        },
        {
          "visual": "First few bites: protein and vegetables alone. Then the carbs join.",
          "line": "Just start with a few bites of protein and vegetables on their own. Then bring in the rice, bread or pasta, and let it finish the meal."
        },
        {
          "visual": "A rice meal: protein, vegetables and salad first, rice at the end.",
          "line": "With rice or pasta meals, have the protein, vegetables and salad first, and keep most of the carbs for the end."
        },
        {
          "visual": "Check-in buttons.",
          "line": "Start with one meal a day. Carbs last. That's the whole habit."
        }
      ]
    },
    "days": [
      {
        "title": "Same food, different order",
        "read": [
          "You have protein and vegetables on your plate. Now we look at something that changes how a meal works without changing what's on it: the order.",
          "Protein first. Vegetables next. Then fats. Carbs last.",
          "When carbs come at the end, the energy from your meal tends to reach your blood more gently. That usually means steadier energy, fewer afternoon slumps, and fewer sudden cravings.",
          "It also means you're already partly full by the time the bread, rice or pasta arrives, so it's easier to be satisfied with a little less, without trying.",
          "Your habit: carbs last. Start with one main meal a day."
        ],
        "action": "Choose which meal you'll start with: lunch or dinner.",
        "type": "lesson"
      },
      {
        "title": "The four steps",
        "read": [
          "Here's the order, simply:",
          "1. Protein: chicken, fish, eggs, tofu, Greek yogurt, paneer. Beans and lentils count partly.",
          "2. Vegetables: salad, cooked vegetables, soup.",
          "3. Fats: nuts, cheese, olive oil, avocado, the butter or ghee in your cooking.",
          "4. Carbs: bread, rice, pasta, roti, potato, fruit, sweets.",
          "In real life, fats are often already cooked into your protein and vegetable dishes. That's fine. They come along naturally in steps 1 and 2.",
          "The one step to protect: carbs last."
        ],
        "action": "Look at your next plate and sort it into the four steps.",
        "type": "lesson"
      },
      {
        "title": "When it all comes together",
        "read": [
          "Sandwiches, wraps, burgers, curries eaten with bread or roti: in many meals, everything arrives at once. We aren't going to change that.",
          "Here's a way that works: start the meal with a few bites of the protein and vegetables on their own, before the bread or rice. Five or six bites is enough to make a difference.",
          "Then eat as you normally would, just leaning more on the protein and vegetables, and less on the bread.",
          "This isn't about being strict. It's about who leads the meal."
        ],
        "action": "At your chosen meal, eat five bites of protein and vegetables before any bread, rice or pasta.",
        "type": "lesson"
      },
      {
        "title": "Rice and pasta meals",
        "read": [
          "Rice meals are easier than they look.",
          "Serve yourself the protein, vegetables and salad first. Eat some of each. Then add the rice or pasta.",
          "With a pasta dish, try a smaller portion of pasta with more vegetables and protein in the sauce, and eat the side salad first. With rice and lentils or dal, eat a few spoons of the dal on its own first.",
          "With mixed dishes like fried rice, risotto or biryani, have a salad or a protein side first, then enjoy the rest.",
          "Rice isn't the problem. It just does better at the end."
        ],
        "action": "At your next rice or pasta meal, eat the protein and vegetables first.",
        "type": "lesson"
      },
      {
        "title": "Serving, not just eating",
        "read": [
          "How your plate is served shapes what you eat first.",
          "Put protein and vegetables on the plate first, in the biggest spaces. Bring the bread or rice a little later, or keep it to one side.",
          "If someone serves you, ask for the bread or rice after the rest. Most families adjust quickly.",
          "When the first thing you see is protein and vegetables, the first thing you eat is usually the same."
        ],
        "action": "Serve your protein and vegetables before the carbs today.",
        "type": "lesson"
      },
      {
        "title": "When the order slips",
        "read": [
          "Some meals will start with warm bread on the table. Some days you'll forget completely. Fresh bread is hard to argue with.",
          "That's fine. The order is a nudge, not a rule you can break.",
          "If you started with the carb, just pause, eat some protein and vegetables, and carry on.",
          "What counts is how most meals go, not how one meal went."
        ],
        "action": "If a meal slips today, just pick up the order at the next one.",
        "type": "lesson"
      },
      {
        "title": "One week of Eating Order",
        "read": [
          "One week of carbs last. How's it going?",
          "Remember, this is your third habit. Protein and vegetables are still with you."
        ],
        "questions": [
          "Which meal was easiest to eat carbs last?",
          "Did you notice anything after meals: energy, fullness, cravings?",
          "Is it time to try carbs last at a second meal?"
        ],
        "action": "Decide whether to add a second meal to this habit this week.",
        "type": "reflect"
      },
      {
        "title": "Snacks follow the same idea",
        "read": [
          "Eating order works for snacks too.",
          "If you're having tea or coffee with biscuits, have a boiled egg, a few nuts or some yogurt first. If you want a fruit, pair it with yogurt or nuts.",
          "The biscuit or fruit still happens. It just comes second, and often you want less of it.",
          "This isn't a new habit, just a small bonus."
        ],
        "action": "Try protein before your next snack.",
        "type": "lesson"
      },
      {
        "title": "Sweets have a place too",
        "read": [
          "Nothing here says no sweets.",
          "If you'd like a sweet, it usually does better at the end of a meal than on its own mid-afternoon. After protein and vegetables, the same dessert lands more gently, and a small portion is often enough.",
          "Enjoy it slowly. Actually taste it. Sweets eaten with attention tend to satisfy more than sweets eaten on autopilot."
        ],
        "action": "If you have a sweet this week, have it after a meal.",
        "type": "lesson"
      },
      {
        "title": "Eating order when eating out",
        "read": [
          "Restaurants are set up for this more than you'd think.",
          "Starters are often protein: grilled chicken, kebabs, prawns, grilled fish, tikka. Order one, along with a salad.",
          "Then the mains, with naan or rice arriving last.",
          "At a buffet or wedding, do a first round of protein and salad, then come back for the rest.",
          "It feels less like a restriction and more like a proper meal."
        ],
        "action": "Next time you eat out, start with a protein starter or salad.",
        "type": "lesson"
      },
      {
        "title": "Nobody needs to notice",
        "read": [
          "Eating in a different order is almost invisible. No special food, no explaining.",
          "At a family dinner, you're simply eating the vegetables and protein before the bread or rice. At an office lunch, you're starting with the salad.",
          "If anyone asks, \"I just like to start with this\" is enough. There's no need to turn a meal into a conversation about food."
        ],
        "action": "Use eating order at a shared meal this week.",
        "type": "lesson"
      },
      {
        "title": "All your main meals",
        "read": [
          "If carbs last feels easy at one meal, try it at all your main meals.",
          "Breakfast can work too: eggs before toast, yogurt before fruit, the omelette before the bread.",
          "If one meal remains tricky, that's fine. Two out of three is a strong habit."
        ],
        "action": "Try carbs last at every main meal tomorrow.",
        "type": "lesson"
      },
      {
        "title": "Three habits, one plate",
        "read": [
          "Look at what you're doing now: a palm of protein, a fist of vegetables, and carbs last. Six weeks ago, most of this probably wasn't happening.",
          "These three work together. Protein and vegetables fill you up. Eating order makes the carbs land gently. None of it requires counting anything.",
          "Tomorrow you'll decide whether to move on."
        ],
        "action": "Notice one meal today where all three habits happened.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of Eating Order",
        "read": [
          "Two weeks of carbs last. Let's take stock."
        ],
        "questions": [
          "On most days, did you eat carbs last at your main meals?",
          "Does it feel natural yet, or still like effort?",
          "Are protein and vegetables still there?"
        ],
        "decision": {
          "moveOnText": "Protein, vegetables, then carbs last. Your plate has a shape now. Next, we'll use your hands to size it.",
          "stayText": "Staying another week is a good choice. This habit changes old routines, and those take time."
        },
        "action": "Choose: move on to Habit 4, or stay one more week.",
        "type": "reflect"
      }
    ]
  },
  {
    "id": "plate-by-hand",
    "n": 4,
    "title": "Build your plate by hand",
    "short": "Palm, fist, cupped hand, thumb",
    "checkin": "Did you build your main meals by hand today?",
    "explainer": {
      "title": "Your hands, your plate",
      "scenes": [
        {
          "visual": "An open palm, a fist, a cupped hand and a thumb, side by side.",
          "line": "You've been using your palm and your fist for weeks. Now let's bring in the whole hand."
        },
        {
          "visual": "Palm next to a chicken breast, fist next to a bowl of vegetables.",
          "line": "A palm of protein. A fist of vegetables. You already know these two."
        },
        {
          "visual": "Cupped hand holding rice; a slice of bread beside it.",
          "line": "A cupped hand of carbs: about a small bowl of rice or pasta, a slice or two of bread, or a medium potato."
        },
        {
          "visual": "A thumb next to a spoon of olive oil and a few almonds.",
          "line": "A thumb of fats: a spoon of oil or butter, a small handful of nuts."
        },
        {
          "visual": "A plate drawn as: palm, fist, cupped hand, thumb.",
          "line": "Put together, that's one balanced plate. Most people start with one of each at a main meal."
        },
        {
          "visual": "Two different-sized hands.",
          "line": "Your hands are sized to you. A taller, more active person has bigger hands, and needs a bigger plate."
        },
        {
          "visual": "A gentle up and down arrow.",
          "line": "These are starting points. In the next habit you'll learn how to adjust them for you."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks, build each main meal by hand. It doesn't need to be perfect. Close is good."
        }
      ]
    },
    "days": [
      {
        "title": "One plate, four parts",
        "read": [
          "You know your palm and your fist. Today we complete the picture.",
          "Palm: protein. Fist: vegetables. Cupped hand: carbs. Thumb: fats.",
          "One of each at a main meal is a good, balanced starting point for most people. No weighing, no apps, no numbers.",
          "Your habit for the next two weeks: build your main meals by hand."
        ],
        "action": "At your next meal, find all four parts on your plate.",
        "type": "lesson"
      },
      {
        "title": "The cupped hand",
        "read": [
          "Carbs are not the enemy. They're energy, and many of our favourite foods live here.",
          "A cupped hand looks like: a small bowl of rice or pasta, one or two slices of bread or rotis, a bowl of cereal, a medium potato, or a piece of fruit.",
          "Most plates have two or three cupped hands without anyone noticing. Just noticing is the first step.",
          "Remember the order you learned: carbs come last."
        ],
        "action": "Count the cupped hands of carbs at lunch today. Just count.",
        "type": "lesson"
      },
      {
        "title": "The thumb",
        "read": [
          "Fats make food taste good and help your body absorb vitamins. They're also dense, so a little goes a long way.",
          "A thumb looks like: a spoon of oil, butter or ghee, a small handful of nuts or seeds, a slice of cheese, a spoon of peanut butter, a quarter of an avocado.",
          "In many dishes, most of the fat is already in the cooking oil and the sauce. So often your thumb is already there before you add anything.",
          "A little butter on your bread is fine. Three pats is a different meal."
        ],
        "action": "Notice where the fat already is in today's meals.",
        "type": "lesson"
      },
      {
        "title": "Bread, rice and pasta, honestly",
        "read": [
          "Bread slices, rotis and rolls are easy to lose count of. Rice and pasta are served in big spoons.",
          "A simple guide: one or two slices of bread, one or two rotis, or a small bowl of rice or pasta is one cupped hand. If you have both bread and rice, that's two.",
          "You don't have to cut back yet. We're just learning what's on the plate.",
          "Next habit, you'll decide if you want a little more, the same, or a little less."
        ],
        "action": "Tonight, notice: bread, rice or pasta, or more than one?",
        "type": "lesson"
      },
      {
        "title": "A big meal by hand",
        "read": [
          "A buffet, a thali or a big family meal can look like a lot. By hand, it's simpler than it seems.",
          "Meat, fish, eggs, tofu or paneer: your palm. Salad and cooked vegetables: your fist. Bread, rice or potatoes: your cupped hand. Butter, dressings, cheese: your thumb.",
          "Sweets and extras sit outside the four parts. They're allowed. They're just extras."
        ],
        "action": "Map your next big meal by hand.",
        "type": "lesson"
      },
      {
        "title": "When you can't see the parts",
        "read": [
          "Some dishes mix everything: lasagne, fried rice, burritos, casseroles, biryani.",
          "Here's a simple way: a mixed dish is mostly carbs. Serve a cupped hand or two of it, then add a palm of protein and a fist of vegetables on the side.",
          "A side salad, a boiled egg, a piece of grilled chicken, a bowl of yogurt. These turn a one-pot meal into a balanced plate."
        ],
        "action": "Add a protein and a vegetable side to your next one-pot meal.",
        "type": "lesson"
      },
      {
        "title": "One week of hands",
        "read": [
          "One week of building your plate by hand. Let's look back."
        ],
        "questions": [
          "Which part is easiest to get right?",
          "Which part surprised you?",
          "Is protein still leading your plate?"
        ],
        "action": "Choose one part to pay extra attention to this week.",
        "type": "reflect"
      },
      {
        "title": "Hands for breakfast",
        "read": [
          "Breakfast by hand: a palm of protein, a cupped hand of carbs, a thumb of fat. Vegetables are a bonus.",
          "Two eggs, one slice of toast, a little butter. Greek yogurt with berries and a few nuts. Scrambled eggs with vegetables and a piece of fruit.",
          "It's a smaller plate than lunch, and that's fine."
        ],
        "action": "Build tomorrow's breakfast by hand.",
        "type": "lesson"
      },
      {
        "title": "Snacks by hand",
        "read": [
          "Snacks don't need all four parts. One or two is plenty.",
          "A palm and a thumb: yogurt with a few nuts. A palm alone: a boiled egg, a cheese stick, roasted chickpeas. A cupped hand with a thumb: a fruit with a few almonds.",
          "A snack is a bridge to the next meal, not a meal of its own."
        ],
        "action": "Build your next snack from one or two parts.",
        "type": "lesson"
      },
      {
        "title": "Bigger hands, bigger plates",
        "read": [
          "Your hands are sized to your body. That's the clever part.",
          "A taller man who trains most days might need two palms of protein and two cupped hands of carbs at a meal. A smaller, less active person might need one of each, or a little less.",
          "Nobody else's plate is the right size for you. Yours is."
        ],
        "action": "Look at your hands next to someone else's in your family. Notice the difference.",
        "type": "lesson"
      },
      {
        "title": "Hunger is information",
        "read": [
          "How do you know if your plate is right? Your body tells you.",
          "About three to four hours after a meal, you should feel ready to eat, not starving and not still full.",
          "Starving an hour later usually means a little more protein or vegetables. Still full at dinner time might mean a little less of something.",
          "We'll use this properly in the next habit."
        ],
        "action": "Two hours after lunch today, check in with your hunger.",
        "type": "lesson"
      },
      {
        "title": "Out of home, by hand",
        "read": [
          "Your hands come to restaurants and weddings too.",
          "At a buffet, use your plate like a hand map: a palm-sized space for protein, a fist for vegetables, a cupped hand for carbs.",
          "One plate built like this, eaten slowly, usually does the job. Seconds are allowed; just choose what you actually want more of."
        ],
        "action": "Next time you eat out, map one plate by hand.",
        "type": "lesson"
      },
      {
        "title": "It's becoming yours",
        "read": [
          "By now, building a plate by hand might happen without much thought.",
          "This is the skill most people never learn: seeing food as parts and putting a meal together on purpose.",
          "Every habit from here builds on it."
        ],
        "action": "Notice one meal today that you built without thinking.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of hands",
        "read": [
          "Two weeks of building your plate by hand. Let's see where you are."
        ],
        "questions": [
          "On most days, did your main meals have all four parts?",
          "Does it feel natural, or still like effort?",
          "How is your hunger between meals?"
        ],
        "action": "Choose: move on to Habit 5, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "Your plate has a shape and a size now. Next, you'll learn to adjust it: more, same or less.",
          "stayText": "Another week is a good choice. This skill is the base for everything that follows."
        }
      }
    ]
  },
  {
    "id": "more-same-less",
    "n": 5,
    "title": "More, same or less",
    "short": "Adjust one portion, based on how things are going",
    "checkin": "Did you eat until satisfied, not stuffed, at your main meals?",
    "explainer": {
      "title": "More, same or less",
      "scenes": [
        {
          "visual": "Three buttons: More, Same, Less.",
          "line": "Your plate has a shape. Now it gets to fit you exactly."
        },
        {
          "visual": "A small notebook with three simple lines: hunger, energy, waist.",
          "line": "Once a week, look at three things: your hunger, your energy, and your waist."
        },
        {
          "visual": "A steady arrow.",
          "line": "If you're moving the way you want, and you feel good: same. Change nothing."
        },
        {
          "visual": "A small cupped hand fading out.",
          "line": "If nothing has moved in two weeks and you'd like it to: less. Take away one small thing, often one cupped hand of carbs at dinner."
        },
        {
          "visual": "A palm growing slightly.",
          "line": "If you're always hungry or tired: more. Usually a bit more protein or vegetables."
        },
        {
          "visual": "A calendar with one change a week.",
          "line": "Only one change at a time, and give it a week. Small, slow changes are the ones that last."
        },
        {
          "visual": "A trend line going gently down with small bumps.",
          "line": "Look at trends, not single days. Bodies go up and down. The direction over weeks is what counts."
        },
        {
          "visual": "Check-in buttons.",
          "line": "Each day, just eat until satisfied, not stuffed. Once a week, decide: more, same or less."
        }
      ]
    },
    "days": [
      {
        "title": "Your plate, adjusted for you",
        "read": [
          "Hands give you a good starting plate. But you are not an average person, so the plate needs tuning.",
          "Once a week you'll look at how things are going and choose one of three answers: more, same, or less.",
          "Daily, your habit is simple: eat until you're satisfied, not stuffed."
        ],
        "action": "Pick a day of the week for your weekly check.",
        "type": "lesson"
      },
      {
        "title": "Satisfied, not stuffed",
        "read": [
          "There's a point in a meal when hunger is gone but you're not heavy. Most of us eat right past it.",
          "Signs you're there: the food tastes a little less exciting, you could stop comfortably, and you'd be fine for a few hours.",
          "Pause for a breath midway through a meal. Ask: how hungry am I now?"
        ],
        "action": "Pause once in the middle of each main meal today.",
        "type": "lesson"
      },
      {
        "title": "Slow down, just a little",
        "read": [
          "Fullness signals take around 15 to 20 minutes to arrive. Fast eating finishes before they do.",
          "You don't need rules like chewing 30 times. Just put your fork down between bites sometimes. Sip water. Talk.",
          "Protein and vegetables first also slows the meal naturally."
        ],
        "action": "Make one meal today take a little longer.",
        "type": "lesson"
      },
      {
        "title": "What to look at each week",
        "read": [
          "Your weekly check has three simple questions.",
          "Hunger: are you mostly comfortable between meals? Energy: steady, or crashing? Waist: measured at the belly button, same time of day, is it moving the way you want?",
          "The scale can join in if you like it, but it jumps around with water and salt. The waist is steadier."
        ],
        "action": "Measure your waist today, at the belly button, before breakfast.",
        "type": "lesson"
      },
      {
        "title": "When to choose same",
        "read": [
          "If things are moving in the direction you want, and you feel good, the answer is same.",
          "This is the most underrated choice. Most people change things that are working, just because change feels productive.",
          "Same is not doing nothing. It's letting a good thing keep working."
        ],
        "action": "Think of one thing that's already working. Keep it.",
        "type": "lesson"
      },
      {
        "title": "When to choose less",
        "read": [
          "If two weeks pass and nothing has moved, and you'd like it to, choose less.",
          "Take away one small thing. Usually the easiest is one cupped hand of carbs at dinner, or one thumb of fat.",
          "Never take away protein or vegetables first. They're the ones keeping you full."
        ],
        "action": "If you were to take away one thing, what would it be? Just decide, don't act yet.",
        "type": "lesson"
      },
      {
        "title": "One week of more, same or less",
        "read": [
          "Your first weekly check. Look at hunger, energy and waist."
        ],
        "questions": [
          "How was your hunger between meals this week?",
          "How was your energy?",
          "So: more, same, or less? What one change, if any?"
        ],
        "action": "Make your one change (or none) for the coming week.",
        "type": "reflect"
      },
      {
        "title": "When to choose more",
        "read": [
          "Sometimes the answer is more.",
          "If you're hungry all the time, tired in the afternoons, or struggling in workouts, you may simply not be eating enough.",
          "Add a little: an extra half palm of protein, or an extra fist of vegetables. Often that fixes the cravings too."
        ],
        "action": "Notice any meal after which you're hungry again too quickly.",
        "type": "lesson"
      },
      {
        "title": "Trends, not days",
        "read": [
          "Your body changes a little from day to day: water, salt, sleep, stress, hormones.",
          "One heavy day means almost nothing. A direction over three or four weeks means a lot.",
          "So look at your weekly checks side by side, not today versus yesterday."
        ],
        "action": "Look back at your last two waist measurements. Notice the direction, not the number.",
        "type": "lesson"
      },
      {
        "title": "Festivals and busy weeks",
        "read": [
          "Some weeks, the answer isn't more or less. It's hold.",
          "A holiday, a wedding, travel, a sick child. In weeks like these, keeping your first habits going is a win.",
          "You can come back to adjusting when life settles."
        ],
        "action": "If a busy week is coming, decide now: hold.",
        "type": "lesson"
      },
      {
        "title": "Your body, your pace",
        "read": [
          "Other people's results are not your timeline.",
          "Someone else's body, age, sleep, stress and history are all different. Comparing only adds pressure.",
          "Your only job is to keep checking in and making small, sensible changes."
        ],
        "action": "Write down one thing that has improved since you started, however small.",
        "type": "lesson"
      },
      {
        "title": "When progress stalls",
        "read": [
          "Every journey has flat weeks. They're normal, not failure.",
          "First, check the basics: is protein still at every meal? Vegetables? Carbs last? Often a habit has quietly slipped.",
          "If the basics are solid, then choose less, by one small step."
        ],
        "action": "Check your first three habits today. Are they all still there?",
        "type": "lesson"
      },
      {
        "title": "You're the coach now",
        "read": [
          "This habit is the one that makes you independent.",
          "You now know how to build a plate and how to adjust it. That's what a nutrition coach does.",
          "The next habits build on this, but this is the core skill."
        ],
        "action": "Notice how it feels to make your own decision about food.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of more, same or less",
        "read": [
          "Your second weekly check, and time to decide."
        ],
        "questions": [
          "On most days, did you stop at satisfied?",
          "Did you make a weekly decision, and stick to it?",
          "What's your answer this week: more, same, or less?"
        ],
        "action": "Choose: move on to Habit 6, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "You can read your body and adjust your plate. Keep doing a weekly check, always. Next: what you drink.",
          "stayText": "Another week of practice is wise. This is a skill that gets easier each time."
        }
      }
    ]
  },
  {
    "id": "sip-smarter",
    "n": 6,
    "title": "Sip smarter",
    "short": "Water first, less sugar in your cup",
    "checkin": "Were most of your drinks unsweetened today?",
    "explainer": {
      "title": "What's in your cup",
      "scenes": [
        {
          "visual": "A row of drinks: sweet tea or coffee, juice, a cold drink, water.",
          "line": "Drinks are easy to forget. Your body doesn't forget them."
        },
        {
          "visual": "Sugar cubes floating up out of a glass of juice.",
          "line": "Sugar in drinks goes in quickly, and it doesn't fill you up the way food does."
        },
        {
          "visual": "A cup of tea or coffee with a sugar spoon hovering, smaller each time.",
          "line": "You don't have to give up your tea or coffee. Try a little less sugar each week. Your taste adjusts."
        },
        {
          "visual": "An orange next to a glass of orange juice.",
          "line": "Whole fruit beats juice. The fibre comes along and slows everything down."
        },
        {
          "visual": "A glass of water on a bedside table, sunrise.",
          "line": "Start the day with a glass of water. Keep one near you through the day."
        },
        {
          "visual": "Sparkling water with lime, unsweetened iced tea, buttermilk, coconut water.",
          "line": "Good swaps: sparkling water with lime, unsweetened iced tea, buttermilk, coconut water now and then."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks: water first, and most of your drinks unsweetened."
        }
      ]
    },
    "days": [
      {
        "title": "Your drinks count too",
        "read": [
          "We've looked at every part of your plate. Now, your cup.",
          "Sweet drinks are one of the easiest places for sugar to slip in unnoticed. Tea or coffee with two spoons of sugar, three times a day, adds up quickly.",
          "Your habit: most of your drinks unsweetened, and water first."
        ],
        "action": "Count today's drinks. Just count, no changes yet.",
        "type": "lesson"
      },
      {
        "title": "Water first",
        "read": [
          "Start each day with a glass of water. Keep a bottle near you.",
          "Mild thirst is sometimes mistaken for hunger or tiredness.",
          "You don't need a fixed number of litres. Pale yellow urine is a good simple sign you're drinking enough."
        ],
        "action": "Put a glass or bottle of water where you'll see it first thing tomorrow.",
        "type": "lesson"
      },
      {
        "title": "Tea and coffee, gently",
        "read": [
          "Tea or coffee is part of the day for most of us, and it can stay.",
          "Try this: reduce the sugar by a quarter this week. Then another quarter next week. Taste buds adapt in a couple of weeks, and most people end up preferring it.",
          "If you have many cups a day, keep your favourite ones and make the others smaller."
        ],
        "action": "Reduce the sugar in your tea or coffee by a little.",
        "type": "lesson"
      },
      {
        "title": "Juice isn't fruit",
        "read": [
          "A glass of juice can hold three or four fruits' worth of sugar, without the fibre that makes fruit filling.",
          "Packaged juices often have added sugar too.",
          "Eat the fruit. Drink water. If you love juice, make it a small glass with a meal, not a drink on its own."
        ],
        "action": "Swap one juice this week for the whole fruit.",
        "type": "lesson"
      },
      {
        "title": "Cold drinks and packaged drinks",
        "read": [
          "Colas, iced teas, energy drinks and flavoured milk are among the sweetest things we consume.",
          "A simple swap: sparkling water with lime and a pinch of salt, or unsweetened iced tea.",
          "'Diet' drinks don't have sugar. They're an okay stepping stone, but water is a better long-term friend."
        ],
        "action": "Choose one packaged drink to replace this week.",
        "type": "lesson"
      },
      {
        "title": "Hidden sugars in your cup",
        "read": [
          "Some drinks sound healthy but aren't: sweetened lattes, bottled smoothies, sports drinks, flavoured yogurt drinks, sweet lassi.",
          "Check the label for sugar near the top of the ingredients list.",
          "Plain milk, unsweetened yogurt drinks or buttermilk are great. The added sugar is what changes them."
        ],
        "action": "Check the label of one drink you have often.",
        "type": "lesson"
      },
      {
        "title": "One week of sipping smarter",
        "read": [
          "One week in. Let's look back."
        ],
        "questions": [
          "Which drink was easiest to change?",
          "Which one is hardest to let go of?",
          "Are you drinking more water than before?"
        ],
        "action": "Choose one drink to focus on this week.",
        "type": "reflect"
      },
      {
        "title": "Alcohol, honestly",
        "read": [
          "Alcohol has calories, loosens our food choices, and disturbs sleep, even when it helps you fall asleep.",
          "If you drink, a few simple guides: have a glass of water between drinks, eat protein before and while drinking, and keep some days in the week alcohol-free.",
          "If cutting back feels hard, that's worth talking about with your doctor. You're not alone in it."
        ],
        "action": "If you drink, plan one alcohol-free day this week.",
        "type": "lesson"
      },
      {
        "title": "Evening drinks",
        "read": [
          "Tea and coffee late in the day can quietly shorten your sleep, even if you fall asleep fine.",
          "Caffeine lasts many hours in the body. Many people sleep better with none after about 2 or 3 in the afternoon.",
          "Evening swaps: warm milk without sugar, herbal tea, warm water with lemon."
        ],
        "action": "Try your last caffeine a little earlier today.",
        "type": "lesson"
      },
      {
        "title": "Drinks when eating out",
        "read": [
          "Restaurants push sweet drinks: mocktails, shakes, fresh lime soda sweet.",
          "Ask for sparkling water with lime, unsweetened iced tea, or just water.",
          "If you want a special drink, have one, enjoy it, and have water with the rest of the meal."
        ],
        "action": "Next time you eat out, order an unsweetened drink first.",
        "type": "lesson"
      },
      {
        "title": "Thirsty or hungry?",
        "read": [
          "Sometimes an afternoon craving is thirst, tiredness or boredom in disguise.",
          "When a craving hits, have a glass of water and wait ten minutes. If you're still hungry, have a proper protein snack.",
          "No willpower needed. Just a small pause."
        ],
        "action": "Try the water-and-wait test once today.",
        "type": "lesson"
      },
      {
        "title": "Your new normal",
        "read": [
          "Two weeks ago, sweet drinks might have been automatic. Now you're choosing.",
          "Less sugar in your cup means steadier energy and fewer cravings, and it often makes food taste better too."
        ],
        "action": "Notice how sweet something tastes now that used to taste normal.",
        "type": "lesson"
      },
      {
        "title": "Six habits in",
        "read": [
          "Look at what you've built: protein first, vegetables, carbs last, a plate by hand, weekly adjustments, and smarter drinks.",
          "That's a complete way of eating. Everything from here makes it easier to keep in real life."
        ],
        "action": "Notice one habit that now feels completely automatic.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of sipping smarter",
        "read": [
          "Let's take stock."
        ],
        "questions": [
          "On most days, were your drinks mostly unsweetened?",
          "How is the sugar in your tea or coffee compared to two weeks ago?",
          "What's still hard?"
        ],
        "action": "Choose: move on, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "Your cup is lighter now. Next up: snacks.",
          "stayText": "Another week will help your taste buds settle. It's worth it."
        }
      }
    ]
  },
  {
    "id": "snack-upgrade",
    "n": 7,
    "title": "Snack upgrade",
    "short": "Protein-led snacks, when you actually need one",
    "checkin": "Were your snacks protein-led today (or not needed)?",
    "explainer": {
      "title": "A better snack",
      "scenes": [
        {
          "visual": "A clock at 4 pm; a packet of biscuits and a bowl of nuts.",
          "line": "4 pm. The biscuit tin calls. Let's make the better choice the easy choice."
        },
        {
          "visual": "A question mark over a stomach.",
          "line": "First, ask: am I hungry, or bored, tired, or thirsty?"
        },
        {
          "visual": "A bowl of Greek yogurt, a boiled egg, a handful of nuts.",
          "line": "If you're hungry, lead with protein: Greek yogurt, a boiled egg, a cheese stick, roasted chickpeas, a handful of nuts."
        },
        {
          "visual": "A packet of crisps getting smaller.",
          "line": "Crisps and biscuits aren't banned. They just come second, and usually you want less."
        },
        {
          "visual": "A jar on a counter, a box in a bag.",
          "line": "Keep your better snack where your hand usually goes."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks: when you snack, lead with protein. And it's fine not to snack at all."
        }
      ]
    },
    "days": [
      {
        "title": "Snacks with a purpose",
        "read": [
          "Snacks can be helpful: they bridge long gaps and stop you arriving at dinner starving.",
          "But many snacks happen out of habit: the office biscuits, the evening crisps in front of the TV.",
          "Your habit: when you snack, make it protein-led. And if you're not hungry, it's fine not to snack."
        ],
        "action": "Notice when you snacked today, and why.",
        "type": "lesson"
      },
      {
        "title": "Hungry, or something else?",
        "read": [
          "Before a snack, take a breath and ask: am I actually hungry?",
          "Real hunger comes on gradually and any food sounds fine. Cravings come suddenly and want one specific thing.",
          "Bored, tired and stressed all feel like hunger sometimes. Water, a short walk or a few minutes away from the screen often helps."
        ],
        "action": "Before your next snack, ask the question once.",
        "type": "lesson"
      },
      {
        "title": "Your protein snack list",
        "read": [
          "Easy protein snacks: Greek yogurt, a boiled egg, cottage cheese, a cheese stick, roasted chickpeas, edamame, a handful of nuts, a protein shake. If you like Indian snacks, roasted chana or paneer cubes work too.",
          "Pick two or three that you actually like. Keep them simple."
        ],
        "action": "Write down your top three protein snacks.",
        "type": "lesson"
      },
      {
        "title": "Make it the easy choice",
        "read": [
          "We reach for what's closest. So put the better snack closest.",
          "A jar of nuts or roasted chickpeas on the counter. Boiled eggs in the fridge. A small box of almonds in your bag.",
          "Move the biscuits to a higher shelf. Not banned, just a little further away."
        ],
        "action": "Put one protein snack within reach at home or work.",
        "type": "lesson"
      },
      {
        "title": "The 4 pm dip",
        "read": [
          "Many people hit a slump in the afternoon. It's partly natural body rhythm, and partly lunch.",
          "A protein-first lunch with carbs last already helps. A small protein snack around 4 pm helps more.",
          "Pair it with a short walk if you can."
        ],
        "action": "Plan your 4 pm snack for tomorrow.",
        "type": "lesson"
      },
      {
        "title": "TV and evening snacking",
        "read": [
          "Evening snacking is often habit, not hunger: TV, phone, winding down.",
          "Try: a clear end to eating after dinner, like brushing your teeth early, or a cup of herbal tea.",
          "If you truly are hungry late, a small bowl of yogurt is gentle."
        ],
        "action": "Try a clear 'kitchen closed' signal after dinner tonight.",
        "type": "lesson"
      },
      {
        "title": "One week of better snacks",
        "read": [
          "One week in. Let's look back."
        ],
        "questions": [
          "When did you snack most?",
          "Which protein snack worked best?",
          "Were there snacks you didn't need?"
        ],
        "action": "Choose one snacking moment to improve this week.",
        "type": "reflect"
      },
      {
        "title": "Fruit as a snack",
        "read": [
          "Fruit is a great snack, but on its own it's mostly carbs.",
          "Pair it: an apple with a few almonds, berries with yogurt, a banana with a spoon of peanut butter.",
          "The pairing keeps you fuller for longer."
        ],
        "action": "Pair your next fruit with a protein or a few nuts.",
        "type": "lesson"
      },
      {
        "title": "Office and travel snacks",
        "read": [
          "Office pantries and railway stations aren't built for protein.",
          "Carry a backup: nuts, roasted chickpeas, a protein bar if you like them.",
          "Nuts and trail mix are easy to overdo, so a small handful is enough."
        ],
        "action": "Pack one backup snack for tomorrow.",
        "type": "lesson"
      },
      {
        "title": "Sweet cravings",
        "read": [
          "Sometimes you want something sweet, and that's human.",
          "Have it after a meal rather than on its own. Have a small amount, slowly. Or try a sweet-ish protein: yogurt with a little fruit, a date with a few nuts.",
          "Guilt doesn't help. Enjoying a small amount on purpose does."
        ],
        "action": "If a sweet craving comes, have a small amount after a meal.",
        "type": "lesson"
      },
      {
        "title": "Kids, family and snacks",
        "read": [
          "What's in the house gets eaten by everyone.",
          "Swapping the family snack shelf a little helps everyone: fruit, nuts, yogurt, roasted chickpeas alongside the usual.",
          "No announcements needed. Just stock it."
        ],
        "action": "Add one better snack to the family shelf this week.",
        "type": "lesson"
      },
      {
        "title": "Fewer snacks, not just better ones",
        "read": [
          "As meals improve, many people find they need fewer snacks.",
          "That's a great sign: your meals are doing their job.",
          "If you're not hungry between meals, there's no need to snack at all."
        ],
        "action": "Notice if you needed fewer snacks this week.",
        "type": "lesson"
      },
      {
        "title": "Seven habits in",
        "read": [
          "Protein first, vegetables, carbs last, plate by hand, more-same-less, smarter drinks, better snacks.",
          "You're eating in a genuinely different way from when you started. Take a moment to notice that."
        ],
        "action": "Tell someone close to you one thing that's changed.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of better snacks",
        "read": [
          "Let's take stock."
        ],
        "questions": [
          "When you snacked, was it usually protein-led?",
          "Did you skip snacks you didn't need?",
          "What's still tricky?"
        ],
        "action": "Choose: move on, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "Snacks work for you now. Next, we look at when you eat: an earlier dinner.",
          "stayText": "Another week helps this settle. Evening habits especially take time."
        }
      }
    ]
  },
  {
    "id": "early-dinner",
    "n": 8,
    "title": "Early dinner",
    "short": "Finish dinner 2–3 hours before bed",
    "checkin": "Did you finish dinner at least 2–3 hours before bed?",
    "explainer": {
      "title": "Work with your body clock",
      "scenes": [
        {
          "visual": "A day-night circle with a sun and a moon.",
          "line": "Your body runs on a daily clock. What you eat matters. So does when."
        },
        {
          "visual": "A moon rising, a small sleep hormone symbol rising with it.",
          "line": "As bedtime gets closer, your body releases melatonin, the hormone that gets you ready for sleep."
        },
        {
          "visual": "A plate at night with a slow, long curve of sugar.",
          "line": "Around this time, your body handles food less smoothly. Sugar from a late meal stays in the blood for longer."
        },
        {
          "visual": "A person eating at 11 pm, then snacking the next day.",
          "line": "In studies, eating late also left people hungrier the next day, and burning a little less energy."
        },
        {
          "visual": "A clock showing dinner finished early; a long quiet night.",
          "line": "So we give the night back to rest: dinner finished two to three hours before bed, then the kitchen closes."
        },
        {
          "visual": "A phone face-down, a dim lamp.",
          "line": "Calm evenings help too: dim lights, less screen time, gentle movement. Save intense workouts for earlier."
        },
        {
          "visual": "A 12-hour arc from dinner to breakfast.",
          "line": "Many people find a natural 12-hour overnight break comes easily once dinner moves earlier."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks: finish dinner two to three hours before bed. Start with a small step if you need to."
        }
      ]
    },
    "days": [
      {
        "title": "When you eat matters too",
        "read": [
          "Everything so far has been about what's on your plate. This habit is about the clock.",
          "Your body is built for a daily rhythm: active in the day, repairing at night. Late, heavy dinners push against that rhythm.",
          "Your habit: finish dinner two to three hours before bed."
        ],
        "action": "Note what time you finished dinner last night.",
        "type": "lesson"
      },
      {
        "title": "What happens at night",
        "read": [
          "As bedtime approaches, your body releases melatonin to prepare for sleep. Around the same time, it gets less efficient at handling food.",
          "That means sugar from a late meal tends to stay in the blood for longer, especially from carb-heavy dinners.",
          "Earlier dinners let your body finish digesting before it settles into sleep."
        ],
        "action": "Plan tonight's dinner time.",
        "type": "lesson"
      },
      {
        "title": "Late eating and hunger",
        "read": [
          "Eating late doesn't just affect the night. In a carefully controlled study, people who ate later felt hungrier the next day, and their appetite hormones shifted toward hunger.",
          "The later we stay up and eat, the more we tend to eat overall, often the less helpful foods.",
          "An earlier dinner is quietly one of the easiest ways to eat a little less without trying."
        ],
        "action": "Notice your hunger tomorrow morning after an earlier dinner.",
        "type": "lesson"
      },
      {
        "title": "Start where you are",
        "read": [
          "If dinner is usually at 10:30, moving it to 7 overnight isn't realistic.",
          "Move it 30 minutes earlier this week, and another 30 next week.",
          "If a late dinner can't be avoided, make it lighter: protein and vegetables, with a smaller cupped hand of carbs."
        ],
        "action": "Choose a dinner time 30 minutes earlier than usual.",
        "type": "lesson"
      },
      {
        "title": "Close the kitchen",
        "read": [
          "After dinner, close the kitchen. A clear end to eating makes the evening easier.",
          "Some people brush their teeth right after dinner. Others make a cup of herbal tea. Pick a signal that works for you.",
          "If you're genuinely hungry later, a small bowl of yogurt is gentle."
        ],
        "action": "Choose your 'kitchen closed' signal tonight.",
        "type": "lesson"
      },
      {
        "title": "Calm evenings",
        "read": [
          "Your evening sets up your sleep. Bright screens, loud work calls and stress all push the body the wrong way.",
          "Dim the lights after dinner. Put the phone down for the last half hour. A short, easy walk after dinner helps digestion too.",
          "If you train in the evening, moderate exercise is fine. Just try to finish intense workouts at least an hour or two before bed."
        ],
        "action": "Put your phone away for the last 30 minutes before bed tonight.",
        "type": "lesson"
      },
      {
        "title": "One week of earlier dinners",
        "read": [
          "One week in. Let's look back."
        ],
        "questions": [
          "What time did you usually finish dinner?",
          "How did you sleep?",
          "How was your hunger in the mornings?"
        ],
        "action": "Choose your dinner time for this week.",
        "type": "reflect"
      },
      {
        "title": "Family and late dinners",
        "read": [
          "In many homes, dinner is late because everyone gets home late.",
          "You can still eat together: have your main dinner earlier, and join the family table later with a cup of tea or a small bowl of soup.",
          "Or move the family dinner a little earlier on weekends first."
        ],
        "action": "Talk to your family about one earlier dinner this week.",
        "type": "lesson"
      },
      {
        "title": "The overnight break",
        "read": [
          "Once dinner is earlier, a longer overnight break often happens by itself. Dinner at 8, breakfast at 8: that's 12 hours.",
          "You don't need to push it further or skip breakfast. Just let the night be a real rest from eating."
        ],
        "action": "Check your overnight gap tonight: dinner to breakfast.",
        "type": "lesson"
      },
      {
        "title": "Weekends and late nights",
        "read": [
          "Parties, weddings and late weekend dinners happen. That's life.",
          "On those nights, eat something small earlier, like a protein snack at 7, so you're not starving at the late meal.",
          "The next day, go back to your normal rhythm. No need to make up for anything."
        ],
        "action": "If you have a late event coming, plan an early protein snack.",
        "type": "lesson"
      },
      {
        "title": "Sleep is part of nutrition",
        "read": [
          "Short sleep makes hunger stronger and cravings louder the next day. It's not weakness. It's biology.",
          "Earlier dinners, calmer evenings and a regular bedtime all feed into each other.",
          "Protect your sleep, and eating well gets easier."
        ],
        "action": "Pick a bedtime and aim for it three nights this week.",
        "type": "lesson"
      },
      {
        "title": "Mornings feel different",
        "read": [
          "Many people notice that with earlier dinners, mornings change: they wake up lighter, and actually hungry for breakfast.",
          "That morning hunger is a good sign. Meet it with a protein-first breakfast."
        ],
        "action": "Notice how you feel when you wake up tomorrow.",
        "type": "lesson"
      },
      {
        "title": "Eight habits in",
        "read": [
          "What you eat, how you build it, how you adjust it, what you drink, how you snack, and now when you eat.",
          "That's a whole way of living with food, in rhythm with your body."
        ],
        "action": "Notice one change in your energy since you started.",
        "type": "lesson"
      },
      {
        "title": "Two weeks of earlier dinners",
        "read": [
          "Let's take stock."
        ],
        "questions": [
          "On most days, did you finish dinner 2–3 hours before bed?",
          "How is your sleep?",
          "What gets in the way?"
        ],
        "action": "Choose: move on, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "Your evenings work with your body now. Next: taking your habits out of the house.",
          "stayText": "Another week is a good choice. Rhythms take a while to reset."
        }
      }
    ]
  },
  {
    "id": "out-and-about",
    "n": 9,
    "title": "Out and about",
    "short": "Your habits at restaurants, weddings and on the road",
    "checkin": "Did your habits come with you today, even away from home?",
    "explainer": {
      "title": "Your habits travel with you",
      "scenes": [
        {
          "visual": "A restaurant menu, a wedding buffet, a train.",
          "line": "Most of life happens away from your kitchen. Your habits can come too."
        },
        {
          "visual": "A hand pointing at the protein on a menu.",
          "line": "At a restaurant, find the protein first: grilled chicken, fish, steak, kebabs, an omelette."
        },
        {
          "visual": "A buffet plate: palm, fist, cupped hand, thumb.",
          "line": "At a buffet, build one plate by hand. Protein and vegetables first, carbs last."
        },
        {
          "visual": "A small plate of sweets, eaten slowly.",
          "line": "Sweets are part of celebrations. Choose the one you really want, and enjoy it slowly."
        },
        {
          "visual": "A bag with nuts, a fruit and a water bottle.",
          "line": "When travelling, carry a backup: nuts, a protein bar, a fruit."
        },
        {
          "visual": "A calendar: one party, then normal days.",
          "line": "One big meal doesn't undo anything. Just return to your habits at the next meal."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks: take one habit with you whenever you eat out."
        }
      ]
    },
    "days": [
      {
        "title": "Real life happens out there",
        "read": [
          "Restaurants, office lunches, weddings, travel, festivals. This is where most eating plans quietly fall apart.",
          "Not yours. Your habits don't need special food. They just need a moment of attention.",
          "Your habit: take your habits with you, wherever you eat."
        ],
        "action": "Think of your next meal away from home. What's the plan?",
        "type": "lesson"
      },
      {
        "title": "The restaurant menu",
        "read": [
          "Read the menu from the protein up: grilled, roasted or baked chicken, fish, steak, egg dishes, tofu, kebabs.",
          "Order a protein starter and a salad or vegetable dish. Then mains.",
          "Breads and rice arrive last, and you'll likely want less of them."
        ],
        "action": "Next time you order in or eat out, choose the protein first.",
        "type": "lesson"
      },
      {
        "title": "Buffets and weddings",
        "read": [
          "Walk around the whole buffet once before you pick anything. Then choose what you really want.",
          "Build your first plate by hand: protein, vegetables, a cupped hand of carbs, a little fat.",
          "Eat slowly. Go back for seconds only of what you truly want more of."
        ],
        "action": "At your next buffet, walk around once before picking.",
        "type": "lesson"
      },
      {
        "title": "Sweets and celebrations",
        "read": [
          "Celebrations have sweets. That's part of the joy.",
          "Pick the one you love most, rather than a bit of everything. Eat it slowly, after your meal.",
          "No guilt, no making up for it the next day."
        ],
        "action": "At your next celebration, choose one sweet you really love.",
        "type": "lesson"
      },
      {
        "title": "Office lunches and canteens",
        "read": [
          "Canteens often serve carb-heavy plates. Look for eggs, chicken, fish, yogurt or beans and take those first.",
          "Carry a backup protein in your bag for days the canteen lets you down.",
          "If the team orders pizza, have a slice or two after a protein and salad, if you can."
        ],
        "action": "Pack one backup protein for work this week.",
        "type": "lesson"
      },
      {
        "title": "Street food and chaat",
        "read": [
          "Street food and fast food are part of life. Some choices are lighter than others.",
          "Grilled skewers, a burrito bowl, a chicken wrap, sushi or a salad with protein are easier to fit in. Deep-fried snacks and big pastries are best as treats.",
          "Share a plate. Taste everything, finish nothing you don't love."
        ],
        "action": "Next time you have street food, try sharing a plate.",
        "type": "lesson"
      },
      {
        "title": "One week out and about",
        "read": [
          "One week in. Let's look back."
        ],
        "questions": [
          "Where did you eat away from home this week?",
          "Which habit was easiest to keep out there?",
          "Which situation is hardest?"
        ],
        "action": "Plan for your hardest situation this week.",
        "type": "reflect"
      },
      {
        "title": "Travel days",
        "read": [
          "Trains, flights and road trips make regular meals hard.",
          "Carry nuts, fruit and a bottle of water. At stations and airports, look for eggs, yogurt, a chicken or egg sandwich, or a salad with protein.",
          "Keep meals roughly at your usual times if you can."
        ],
        "action": "Pack a small travel snack kit for your next trip.",
        "type": "lesson"
      },
      {
        "title": "Staying with family",
        "read": [
          "At someone else's home, food is love. Refusing can feel rude.",
          "Take small first servings. Start with the protein and vegetables. Praise the cooking generously.",
          "A kind 'I'm so full, but it was wonderful' works in every language."
        ],
        "action": "Practise your kind 'no, thank you' line.",
        "type": "lesson"
      },
      {
        "title": "Festivals",
        "read": [
          "Christmas, Diwali, Eid, Thanksgiving, birthdays. Festive seasons often come with weeks of sweets and gatherings.",
          "Keep your anchor habit going: protein first at your main meals. Let the rest be flexible.",
          "After the festival, return to your normal rhythm. No detox needed. Your body handles that itself."
        ],
        "action": "Pick your anchor habit for the next festival.",
        "type": "lesson"
      },
      {
        "title": "Drinks when out",
        "read": [
          "At restaurants and parties, drinks add up fast: cocktails, sweet mocktails, milkshakes, alcohol.",
          "Start with water or a salted lime soda. If you drink alcohol, alternate with water and eat protein first."
        ],
        "action": "Order water or an unsweetened drink first next time.",
        "type": "lesson"
      },
      {
        "title": "The next meal",
        "read": [
          "One big meal doesn't undo weeks of good habits. The next meal matters more.",
          "After a heavy day, don't skip meals or punish yourself. Just go back to your usual plate.",
          "That's the real skill: returning, again and again."
        ],
        "action": "After your next big meal out, go straight back to normal.",
        "type": "lesson"
      },
      {
        "title": "Nine habits in",
        "read": [
          "You now eat well at home and away. That's the difference between a diet and a way of living.",
          "A few habits left, and they're about keeping all of this for life."
        ],
        "action": "Notice one situation that used to be hard and now feels easier.",
        "type": "lesson"
      },
      {
        "title": "Two weeks out and about",
        "read": [
          "Let's take stock."
        ],
        "questions": [
          "Did your habits come with you when you ate out?",
          "Which situation still feels hard?",
          "What helped most?"
        ],
        "action": "Choose: move on, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "You can eat well anywhere now. Next: weekends.",
          "stayText": "Another week is worth it. Real-life situations are the true test."
        }
      }
    ]
  },
  {
    "id": "weekends",
    "n": 10,
    "title": "Weekends",
    "short": "Keep one anchor habit, every day",
    "checkin": "Did you keep your anchor habit today?",
    "explainer": {
      "title": "Seven days, not five",
      "scenes": [
        {
          "visual": "A week: five neat days and two scribbled ones.",
          "line": "Many people eat well all week, then the weekend washes it away."
        },
        {
          "visual": "A single anchor on a rope.",
          "line": "The fix isn't perfection on weekends. It's one anchor habit you keep every single day."
        },
        {
          "visual": "A plate with a palm of protein highlighted.",
          "line": "For most people, the best anchor is Protein First. It pulls everything else along."
        },
        {
          "visual": "A late brunch, a family outing, a movie.",
          "line": "Weekends are for rest and fun. Enjoy them, with your anchor in place."
        },
        {
          "visual": "Sunday evening: a pot of boiled eggs, a tray of roasted chicken, chopped vegetables.",
          "line": "A little Sunday prep makes Monday easy."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks: keep your anchor habit every day, weekends included."
        }
      ]
    },
    "days": [
      {
        "title": "The weekend gap",
        "read": [
          "Weekday routines help. Weekends take them away: late mornings, brunches, outings, takeaways.",
          "Many people eat well five days a week and undo some of it in two.",
          "The fix isn't strict weekends. It's one anchor habit that you keep every day."
        ],
        "action": "Choose your anchor habit. For most people, it's Protein First.",
        "type": "lesson"
      },
      {
        "title": "Why one anchor works",
        "read": [
          "When one habit stays, the others tend to follow. Protein at breakfast makes a big brunch less likely. Carbs last makes a takeaway lighter.",
          "One anchor is easy to remember and easy to keep, even on a lazy Sunday."
        ],
        "action": "Tell yourself your anchor out loud once today.",
        "type": "lesson"
      },
      {
        "title": "Weekend mornings",
        "read": [
          "Late wake-ups often mean a late, big brunch, then snacking, then a late dinner.",
          "Try a small protein breakfast even on lazy mornings: eggs, Greek yogurt, cottage cheese. It keeps the rest of the day steadier."
        ],
        "action": "Plan this weekend's first meal.",
        "type": "lesson"
      },
      {
        "title": "Takeaway nights",
        "read": [
          "Takeaway is fine. Order with your habits: a protein dish, a vegetable dish, then breads or rice.",
          "Serve it onto plates, not straight from the boxes. You'll eat what you meant to, not what's left."
        ],
        "action": "Next takeaway, serve it onto plates.",
        "type": "lesson"
      },
      {
        "title": "Family outings",
        "read": [
          "Malls, movies, day trips. Food is everywhere and often not great.",
          "Eat a proper meal before you go, and carry water and a snack.",
          "Popcorn at a movie is fine. Share a small one."
        ],
        "action": "Plan one outing with a meal beforehand.",
        "type": "lesson"
      },
      {
        "title": "Sunday prep",
        "read": [
          "Twenty minutes on Sunday makes the week easier.",
          "Boil eggs. Roast a tray of chicken or tofu. Chop vegetables. Wash salad leaves. Cook a pot of lentils or beans.",
          "It isn't meal prep with boxes. It's just a head start."
        ],
        "action": "Choose two things to prep this Sunday.",
        "type": "lesson"
      },
      {
        "title": "One week of weekends",
        "read": [
          "Let's look back at your first weekend with an anchor."
        ],
        "questions": [
          "Did you keep your anchor on Saturday and Sunday?",
          "What got in the way?",
          "What helped?"
        ],
        "action": "Adjust your weekend plan for this week.",
        "type": "reflect"
      },
      {
        "title": "Sleep on weekends",
        "read": [
          "A very late weekend night shifts your body clock, and Monday feels like jet lag.",
          "Try to keep weekend wake-up times within an hour or two of weekdays.",
          "Your hunger and energy will thank you on Monday."
        ],
        "action": "Set a weekend wake-up time close to your weekday one.",
        "type": "lesson"
      },
      {
        "title": "Social weekends",
        "read": [
          "Weekends are for friends and family. Food brings people together.",
          "You don't need to explain your habits. Just take protein and vegetables first, and enjoy the company.",
          "The best meals are about who you're with."
        ],
        "action": "Enjoy one social meal this weekend without worrying.",
        "type": "lesson"
      },
      {
        "title": "Monday reset",
        "read": [
          "If the weekend went sideways, Monday isn't a restart. It's just a normal day.",
          "No punishment, no skipped meals. Just your usual protein-first breakfast."
        ],
        "action": "Plan Monday's breakfast on Sunday night.",
        "type": "lesson"
      },
      {
        "title": "Moving on weekends",
        "read": [
          "Weekends are a great time for longer walks, a game, a swim, a dance class.",
          "Movement you enjoy on weekends makes the whole week feel better."
        ],
        "action": "Plan one active thing this weekend.",
        "type": "lesson"
      },
      {
        "title": "Seven days, not five",
        "read": [
          "You're building habits that work every day of the week, not just when life is structured.",
          "That's what lasts."
        ],
        "action": "Notice how Monday feels after a weekend with your anchor.",
        "type": "lesson"
      },
      {
        "title": "Ten habits in",
        "read": [
          "One more to go. And it's the most important: making all of this yours for life."
        ],
        "action": "Look back at your journey. Which habit changed the most?",
        "type": "lesson"
      },
      {
        "title": "Two weeks of weekends",
        "read": [
          "Let's take stock."
        ],
        "questions": [
          "Did your anchor stay in place on weekends?",
          "How did Mondays feel?",
          "What's your plan for future weekends?"
        ],
        "action": "Choose: move on, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "Your weeks are whole now. One habit left: owning it.",
          "stayText": "Another week of weekends is a good idea. Practice makes it natural."
        }
      }
    ]
  },
  {
    "id": "own-it",
    "n": 11,
    "title": "Own it",
    "short": "Choose the habits you'll keep for life",
    "checkin": "Did you practise your chosen habits today?",
    "explainer": {
      "title": "Yours for life",
      "scenes": [
        {
          "visual": "A path winding back through eleven small markers.",
          "line": "Look how far you've come. Eleven habits, one at a time."
        },
        {
          "visual": "A hand choosing three cards from a fan.",
          "line": "Now you choose. Pick the three habits that matter most to you."
        },
        {
          "visual": "A small toolbox.",
          "line": "The rest stay in your toolbox. Pick them up whenever you need them."
        },
        {
          "visual": "A person noticing a slip, then smiling and carrying on.",
          "line": "Slips will happen. You know what to do: go back to the next meal."
        },
        {
          "visual": "A calendar with a small weekly check mark.",
          "line": "Keep your weekly check: more, same or less. It keeps you steering."
        },
        {
          "visual": "A door opening to a garden.",
          "line": "This isn't the end of a plan. It's how you eat now."
        },
        {
          "visual": "Check-in buttons.",
          "line": "For two weeks: practise your chosen habits, and notice how far you've come."
        }
      ]
    },
    "days": [
      {
        "title": "Your habits, your choice",
        "read": [
          "You've learned eleven habits. You don't need to think about all of them every day.",
          "Choose the three that make the biggest difference for you. They're your core. The rest are your toolbox."
        ],
        "action": "Choose your three core habits.",
        "type": "lesson"
      },
      {
        "title": "Why three",
        "read": [
          "Three is enough to keep everything steady, and few enough to remember.",
          "For many people it's Protein First, Carbs last and Early dinner. For others, it's something else. There's no wrong answer."
        ],
        "action": "Write your three core habits somewhere you'll see them.",
        "type": "lesson"
      },
      {
        "title": "Your toolbox",
        "read": [
          "The other habits don't disappear. They're tools.",
          "Festival season? Out and about. Plateau? More, same or less. Sugar creeping back? Sip smarter.",
          "You'll know which one to reach for."
        ],
        "action": "Name one tool you might need in the next month.",
        "type": "lesson"
      },
      {
        "title": "When you slip",
        "read": [
          "You will have off weeks. Everyone does: illness, travel, stress, celebrations.",
          "A slip is not a failure. It's information. What got in the way?",
          "Go back to your three core habits at the next meal. That's all."
        ],
        "action": "Write down what you'll do the next time you slip.",
        "type": "lesson"
      },
      {
        "title": "Keep your weekly check",
        "read": [
          "Once a week, look at hunger, energy and waist. Decide: more, same or less.",
          "It takes two minutes, and it keeps you steering instead of drifting."
        ],
        "action": "Put your weekly check in your calendar.",
        "type": "lesson"
      },
      {
        "title": "How far you've come",
        "read": [
          "Think back to the start: what your plate looked like, how your afternoons felt, what you believed about food.",
          "Look how much has changed. You did that, one small habit at a time."
        ],
        "action": "Write down three things that are different now.",
        "type": "lesson"
      },
      {
        "title": "One week of owning it",
        "read": [
          "One week with your three core habits."
        ],
        "questions": [
          "Did your three core habits hold this week?",
          "Did you need a tool from your toolbox?",
          "Would you change any of your three?"
        ],
        "action": "Adjust your three if needed.",
        "type": "reflect"
      },
      {
        "title": "Teaching others",
        "read": [
          "When you explain something, you understand it more deeply.",
          "If someone asks what you've changed, tell them about one habit. Not a diet, just one habit."
        ],
        "action": "Share one habit with someone who asks.",
        "type": "lesson"
      },
      {
        "title": "Food and feelings",
        "read": [
          "Sometimes we eat for comfort, stress or boredom. That's human.",
          "Notice it without judgement. Ask what you actually need: rest, company, a walk, a cry, a break.",
          "Food can be one comfort among many, rather than the only one."
        ],
        "action": "Next time you reach for comfort food, pause and ask what you need.",
        "type": "lesson"
      },
      {
        "title": "Your body over time",
        "read": [
          "Bodies change with age. After 40, muscle is easier to lose and harder to build.",
          "Protein, movement and sleep matter more every year. You already have the habits that protect you."
        ],
        "action": "Plan one strength or movement session this week.",
        "type": "lesson"
      },
      {
        "title": "A way of eating, not a diet",
        "read": [
          "Diets end. Habits don't.",
          "There's nothing to finish, nothing to come off. This is simply how you eat now, with room for celebrations and messy weeks."
        ],
        "action": "Notice one meal today that you enjoyed and that fits your habits.",
        "type": "lesson"
      },
      {
        "title": "Look back at your lessons",
        "read": [
          "Every lesson you've read is saved in your Journey. You can reread any of them, anytime.",
          "Coming back to a lesson during a hard week is a great way to reset."
        ],
        "action": "Open your Journey and reread one favourite lesson.",
        "type": "lesson"
      },
      {
        "title": "Nearly there",
        "read": [
          "Tomorrow you'll look back on this whole journey.",
          "Whatever you choose next, you have everything you need."
        ],
        "action": "Take a quiet minute to notice how you feel about food now.",
        "type": "lesson"
      },
      {
        "title": "Your journey",
        "read": [
          "You've come the whole way. Let's look back."
        ],
        "questions": [
          "Which habit changed your life the most?",
          "What are your three core habits?",
          "What would you tell yourself on day one?"
        ],
        "action": "Choose: finish, or stay one more week.",
        "type": "reflect",
        "decision": {
          "moveOnText": "This is how you eat now. Keep your three core habits, keep your weekly check, and come back to any lesson whenever you need it.",
          "stayText": "Another week is always a good choice. There's no finish line you have to cross."
        }
      }
    ]
  }
];

// 7-day Reset: its own fast path, one new idea a day.
const KFIT_RESET = {
  "id": "reset",
  "title": "7-day Reset",
  "short": "Seven days, seven small shifts",
  "explainer": {
    "title": "Seven days, seven small shifts",
    "scenes": [
      {
        "visual": "A calendar with seven soft squares.",
        "line": "This week isn't about eating less, cutting foods out, or starving anything out of your system."
      },
      {
        "visual": "A single plate, calm and simple.",
        "line": "It's about seven small shifts. One new one each day, each small enough to start today."
      },
      {
        "visual": "Palm, fist, and a numbered order: protein, vegetables, fats, carbs.",
        "line": "Protein first. Vegetables next. Carbs last. These three change how every meal works."
      },
      {
        "visual": "A moon over a kitchen with the lights off.",
        "line": "Then when you eat: an earlier dinner, and a proper overnight break."
      },
      {
        "visual": "A cup of tea or coffee, a glass of water, a bowl of nuts.",
        "line": "Then what you sip and what you snack on."
      },
      {
        "visual": "Seven squares, some dark, some light, one empty.",
        "line": "You won't do all of them perfectly. You don't need to. Try each one, keep what works."
      },
      {
        "visual": "A path leading on from the calendar.",
        "line": "By day seven you'll know which shifts feel easy, and where you'd like to go next."
      }
    ]
  },
  "days": [
    {
      "title": "Day 1: Protein at every meal",
      "read": [
        "Let's start with the shift that does the most.",
        "At each main meal today, have a palm of protein: 2 eggs, a chicken breast, a fish fillet, a block of tofu or paneer, or a bowl of Greek yogurt.",
        "Protein keeps you full for longer and steadies your energy. Many everyday meals are light on it, so adding it is a real change.",
        "You don't need to remove anything. Just add the protein, and eat it first if you can."
      ],
      "action": "Plan your protein for each meal today.",
      "checkin": "Did you have a palm of protein at each main meal?",
      "type": "lesson"
    },
    {
      "title": "Day 2: A fist of vegetables",
      "read": [
        "Keep yesterday's protein. Today, add a neighbour.",
        "At lunch and dinner, have a fist of vegetables: a bowl of cooked vegetables, a side salad, a bowl of soup.",
        "Vegetables fill your plate and your stomach without weighing you down, and the fibre keeps digestion steady.",
        "Potatoes and corn are lovely, but they count as carbs, so pick something green or colourful too."
      ],
      "action": "Make sure there's a vegetable at lunch and dinner.",
      "checkin": "Did you have a fist of vegetables at lunch and dinner?",
      "type": "lesson"
    },
    {
      "title": "Day 3: Carbs last",
      "read": [
        "Same food, different order.",
        "Eat your protein first, then vegetables, then fats, and keep the bread, rice or pasta for last.",
        "When carbs come at the end, the meal's energy arrives more gently. Most people notice fewer slumps and fewer cravings.",
        "Some meals come all together, like a sandwich or a curry with bread, and that's fine. Just take five or six bites of protein and vegetables on their own before the carbs join in."
      ],
      "action": "At every main meal, start with five bites of protein and vegetables.",
      "checkin": "Did you eat your carbs last today?",
      "type": "lesson"
    },
    {
      "title": "Day 4: An earlier dinner",
      "read": [
        "Today's shift is about when, not what.",
        "Try to finish dinner a little earlier, ideally two to three hours before bed. Then give yourself a long overnight break, around 12 hours, until breakfast.",
        "As bedtime nears, your body handles food less smoothly: sugar from a late meal stays in the blood for longer. Eating late also tends to leave people hungrier the next day.",
        "If late dinners are part of your life, move it even 30 minutes earlier. Every bit counts."
      ],
      "action": "Pick a time to finish dinner tonight, and close the kitchen after.",
      "checkin": "Did you finish dinner earlier and close the kitchen?",
      "type": "lesson"
    },
    {
      "title": "Day 5: What you sip",
      "read": [
        "Drinks slip past our attention, and their sugar does too.",
        "Today: start the day with a glass of water. Have your tea or coffee with a little less sugar than usual. Swap juice or a cold drink for water, sparkling water with lime, or unsweetened iced tea.",
        "No need to give up tea or coffee. Just notice how many cups, and how sweet.",
        "Whole fruit beats juice every time, because the fibre comes along."
      ],
      "action": "Reduce the sugar in one drink today.",
      "checkin": "Did you swap or reduce at least one sweet drink?",
      "type": "lesson"
    },
    {
      "title": "Day 6: A better snack",
      "read": [
        "Most snacking isn't hunger. It's habit, boredom, or a long gap between meals.",
        "Today, when a snack calls, reach for one with protein: a boiled egg, Greek yogurt, a handful of nuts, a cheese stick, roasted chickpeas.",
        "Crisps and biscuits aren't banned. They just aren't the first choice today.",
        "Keep one ready in your bag or on the counter, so the easy option is the better one."
      ],
      "action": "Keep one protein snack within reach today.",
      "checkin": "Did you choose a protein snack over crisps or biscuits?",
      "type": "lesson"
    },
    {
      "title": "Day 7: Look back, then choose",
      "read": [
        "Seven days, seven shifts. Let's see what stuck.",
        "You didn't need to do every one perfectly. The point was to try them, notice how you felt, and find the ones that feel easy."
      ],
      "questions": [
        "Which shift felt easiest?",
        "Which one made the biggest difference to how you felt?",
        "Which one would you like more help with?"
      ],
      "decision": {
        "moveOnText": "Ready to make these last? Foundations builds them one at a time, so they become habits, not just a good week.",
        "stayText": "Want another go first? Repeating the week is a good choice. It gets easier the second time."
      },
      "action": "Choose: continue to 1-month Foundations, or repeat the Reset.",
      "checkin": null,
      "type": "reflect"
    }
  ]
};

// Templates: paths through the same lessons. pace = days per habit; at pace 7 a
// habit uses its first 6 days and day 7 becomes its final decision.
const KFIT_TEMPLATES = [
  {
    "id": "reset-7d",
    "name": "7-day Reset",
    "weeks": 1,
    "path": [
      "reset"
    ],
    "pace": null,
    "next": "foundations-1m"
  },
  {
    "id": "foundations-1m",
    "name": "1-month Foundations",
    "weeks": 4,
    "path": [
      "protein-first",
      "fibre-second",
      "eating-order",
      "plate-by-hand"
    ],
    "pace": 7,
    "next": "core-3m"
  },
  {
    "id": "core-3m",
    "name": "3-month Core",
    "weeks": 13,
    "path": [
      "start",
      "protein-first",
      "fibre-second",
      "eating-order",
      "plate-by-hand",
      "more-same-less",
      "sip-smarter"
    ],
    "pace": 14,
    "next": "complete-6m"
  },
  {
    "id": "complete-6m",
    "name": "6-month Complete",
    "weeks": 26,
    "path": [
      "start",
      "protein-first",
      "fibre-second",
      "eating-order",
      "plate-by-hand",
      "more-same-less",
      "sip-smarter",
      "snack-upgrade",
      "early-dinner",
      "out-and-about",
      "weekends",
      "own-it"
    ],
    "pace": 14,
    "next": null
  }
];
