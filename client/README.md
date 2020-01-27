Author: Sherllon Alves

I've decided to bootstrap the project from `create-react-app` instead of configuring all packages in order to save time, a TO-DO
for this action is to clean up all unnecessary packages that come with the bundle. Note: I've already ejected from `create-react-app`
so some configuration is already custom, as server PORT.

On the App.js lives the majority of the project. There I'm using a hook to initially set an interval to fetch the data every 2s. If
a response has status 202 we ignore it. As the first load might take a while I've set a `Loading` view (Note: as improvement point this should be moved into a separated component and improved).

I've created a `UpdateButton` component to take care of the increase/decrease target temperature as their behavior is quite similar,
in this project I've not used a state management framework, hence I'm passing it as a parameter to those components.
On the click callback I've added a fetch to `PATCH` the data, as multiple clicks might happen I'm using a flag `isUpdating` to
guarantee that only one call happens at the same time. I'm also holding on a different state what's the desired target temperature
so if we by any chance miss the last click we update the target temperature once we `GET` the data from the server. (One flaw with this system might be when we're fetching the data just before the PATCH happens on the server side, so as follow up I'd look into this).
