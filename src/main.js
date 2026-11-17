import { getNode, getNodes, cloneTemplate, forEach, on } from './utils/dom.js';
import { loadJson, loadJsonUrls } from './utils/fetch.js';

const FILMS_API_URL = "https://swapi.dev/api/films/";

const MOVIES_DIV = getNode('#movies');

const data = await loadJson(FILMS_API_URL);
const results = data['results'];
results.sort((a, b) => a.episode_id - b.episode_id);

for (let i = 0; i < results.length; i++) {
    const infos = results[i];
    let article = cloneTemplate('#movie-template');

    article.setAttribute('data-movie-id', infos.episode_id);
    getNode('.movie-episode', article).innerText = infos.episode_id;
    getNode('.movie-name', article).innerText = infos.title;

    const urls = JSON.stringify(infos.planets);
    getNode('.btn-planets', article).setAttribute('data-planet-urls', urls);

    MOVIES_DIV.append(article);
}

on('.btn-planets', 'click', async (btn) => {
    btn.disabled = true;
    let planets = await loadJsonUrls(JSON.parse(btn.getAttribute('data-planet-urls')));
    planets.sort((a, b) => a.name.localeCompare(b.name));

    const movie = btn.closest('.movie');
    const planetsList = getNode('.planets', movie);

    for (let i = 0; i < planets.length; i++) {
        const infos = planets[i];
        let planet = cloneTemplate('#planet-template');

        getNode('.planet-climate', planet).innerText = infos.climate;
        getNode('.planet-name', planet).innerText = infos.name;
        getNode('.planet-diameter', planet).innerText = infos.diameter;

        planetsList.append(planet);
    }
})