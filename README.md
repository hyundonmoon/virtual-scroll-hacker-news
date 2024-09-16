# Hacker News Virtual Scroller

This project is a simple implementation of a virtual scrolling list using vanilla JavaScript, combined with the Hacker News API. The project’s primary goal was to learn how virtual scrollers are implemented, how to use Intersection Observers (which are used here), and to understand why virtual scrollers are essential for performance when dealing with large datasets where users might need to scroll through thousands of items.

Users can scroll through Hacker News articles fetched dynamically from the API, while only at most 40 article nodes are rendered in the DOM at any given time. The Intersection Observer API is used to detect when the user has scrolled past certain points, which trigger a re-render of the list with either data from previous API calls or the responses of new API calls. To limit the number of article elements in the DOM, these elements are reused rather than being destroyed, ensuring smooth scrolling and efficient performance even as the list of articles grows.

## Features

- Virtual scrolling: Only a fixed number of DOM elements are rendered at any time, regardless of the data size, significantly reducing the DOM tree size and thus improving performance.
- Hacker News API integration: Fetches articles dynamically from the Hacker News API as the user scrolls down.
- Efficient DOM tree management: Elements are pooled and reused instead of being destroyed and recreated, which minimizes layout thrashing and unnecessary reflows.

## What I Learned

- Performance: Using a virtual scroller can significantly improve the performance of an app, especially on more restricted devices such as phones and older computers.
- Vanilla JavaScript & DOM Manipulation: While I usually use frameworks like React or Angular when creating frontend apps, this project gave me hands-on experience working directly with the DOM without relying on frameworks.
- Challenges: Drawing elements in their correct positions was a lot more difficult than I thought it would, and I gained a deeper understanding of why virtual scroll implementations often require that all items be of the same height.

## Roadmap

Here's a list of planned improvements and features I hope to add:

- Add a Loading Bar: Display a loading bar when new articles are being fetched from the API to improve user experience.
- API call and replaint cancellation: Implement functionality to cancel previous API calls and repaints when the user scrolls up and down rapidly, preventing unnecessary operations and improving responsiveness.
- Scrollbar height size fix: Fix the current issue where the scrollbar decreases in size when scrolling back up.

## Contributing

Feel free to fork this project and make contributions. Pull requests are welcome.
