# GameOn

This is a university project's final assignment of the course Systems Analysis and Development.
It's still under development so do not mess with the branches.

## Technology

We chose to use React Native and Expo as framework, our final project needs to run on mobiles both Android and IOS, and we came to the conclusion that Web is a great extra.

## About Execution

Run `npm install` to install dependecies if there is a need.
Run `npx expo start` to start server at localhost port 8081. Use the `-c` flag to clean the cache as starts.
If Expo Go isn't starting the project, try `npm i -g @expo/ngrok@latest` then `npx expo start -c --tunnel`.

## Branches

- main
  DO NOT COMMIT if there is no need to fix incompatibilities;
  DO NOT MERGE or PUSH unless the code is approved;
 
- dev
  DO NOT COMMIT if the code is in any form of unstable;
  DO NOT MERGE or PUSH unstable code unless it is fixed and approved;
  
- unstable
  If the code is presenting errors, bugs, or unintentional comportament, THIS BRANCH SHOULD BE USED.