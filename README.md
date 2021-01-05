# Maliavanka

Maliavanka is a multiplayer single page drawing and guessing game in belarussian language. 

# Flow
After authorization (login through email or guest feature) procedure user has to select the room to play in. Game starts automatically when 2 or more users
are in the same room. Active player selects the word to draw and starts drawing, while others try to guess the word correctly in the chat. The letters of the
secret word are revealed 3 times per each drawing to help players guess wright. But the faster user guesses correctly more points he gets. 
Each game consists of three rounds and each player in the room has opportunity to draw once per round. After game is finished a new one will always be started 
automatically unless there is 1 or no players in the room.

# Tech
- BE: Node, Express, MongoDB, SocketIO.
- FE: React, Canvas API, SocketIO-client, Styled Components, Materialize.

# Testing game for non belarusian speaker:
You could just translate all page with google translate or:
1. Press button "Гуляць" (Play) on the main page.
2. You'll be redirected to auth page. In the modal window select "Быць госцем" (Play as guest).
3. Enter your name in "Імя" (Name) input field and press "Гуляць" (Play).
4. Select one of the rooms and press "Далучыцца" (Join) button.
5. If there is no one in the room open another browser window and join the same room to test the game features.
