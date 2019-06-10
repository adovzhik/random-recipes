import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';

import RecipeList from './RecipeList.js';
import './App.css';

// Base API Request
const BASE_URL = 'https://api.edamam.com/';
// No financial info tied to this account
const API_ID = 'e118caf4';
const API_KEY = '9d160054f9bd11f601ddf6a407bb90e4';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: "",
      dietaryRestriction: "",
      returnedRecipes: [],
      savedRecipes: [],
      resultsText: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleFormSelect = this.handleFormSelect.bind(this);
  }

  componentDidMount() {
    this.updateStateFromLocalStorage();
    // update recipes in localStorage when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.updateRecipesInLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.updateRecipesInLocalStorage.bind(this)
    );
    // saves if component has a chance to unmount
    this.updateRecipesInLocalStorage();
  }

  saveRecipe = (idx) => {
    const selectedRecipe = this.state.returnedRecipes[idx];
    if (this.state.savedRecipes.includes(selectedRecipe)) {
      alert('This recipe has already been saved!');
      return;
    }

    this.setState(prevState => {
      return {
        savedRecipes: [...prevState.savedRecipes, selectedRecipe]
      };
    });
  }

  deleteRecipe = (idx) => {
    this.setState(prevState => {
      const savedRecipes = [...prevState.savedRecipes];
      savedRecipes.splice(idx, 1);

      return {
        savedRecipes
      }
    });
  }

  updateRecipesInLocalStorage() {
    localStorage.setItem("savedRecipes", JSON.stringify(this.state.savedRecipes));
  }

  // localStorage updates follow steps outlined in
  // https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2
  updateStateFromLocalStorage() {
    const key = "savedRecipes";
    if (localStorage.hasOwnProperty(key)) {
      const value = JSON.parse(localStorage.getItem(key));
      this.setState({ savedRecipes: value });
    }
  }

  handleTextInput(event) {
    this.setState({ ingredient: event.target.value });
  }

  handleFormSelect(event) {
    this.setState({ dietaryRestriction: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.fetchData();
  }

  fetchData() {
    // API REQUEST
    const food = this.state.ingredient;
    // optional health restriction parameter
    const healthParam = (this.state.dietaryRestriction === '') ? '' : `&health=${this.state.dietaryRestriction}`;
    // find 10 random results
    const start = Math.floor(Math.random() * 80);
    const end = start + 10;
    const rangeParam = `&from=${start}&to=${end}`;
    // request URL
    const url = `${BASE_URL}search?q=${food}&app_id=${API_ID}&app_key=${API_KEY}${rangeParam}${healthParam}`;

    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        const recipes = responseJson.hits;
        // if there aren't any hits
        if (!recipes.length) {
          this.setState({
            resultsText: "No results found, please try a different query!",
          });
        }
        this.setState({
          returnedRecipes: recipes
        });
      })
      .catch(error => {
        this.setState({
          resultsText: "Error retrieving recipes. Please try again later.",
        });
      });
  }

  render() {
    const resultsElem = (this.state.returnedRecipes.length > 0) ?
      <div>
        <h2>Results</h2>
        <RecipeList
          recipes={this.state.returnedRecipes}
          onSecondaryCTAClick={this.saveRecipe}
          secondaryCTAText="Save Recipe"
        />
      </div>
      : <div><h2>Results</h2>{this.state.resultsText}</div>

    return (
      <div className="App">
        <h1>
          Random Recipes
        </h1>
        <p>Do you ever have a single ingredient in your fridge that you don't know what to do with?</p>
        <p>Enter keywords below to receive 10 random recipe suggestions!</p>
        <hr />
        <Container>
          <Row>
            <Col>
              <h2>Search Now</h2>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group >
                  <Form.Label>Ingredient(s):</Form.Label>
                  <Form.Control type="text" placeholder="ex: onion, potato and celery" onChange={this.handleTextInput} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Dietary Restrictions (optional):</Form.Label>
                  <Form.Control as="select" onChange={this.handleFormSelect}>
                    <option value="">None</option>
                    <option value="tree-nut-free">Tree Nut-Free</option>
                    <option value="peanut-free">Peanut-Free</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="outline-primary" type="submit">
                  Find Recipes
                </Button>
              </Form>
            </Col>
            <Col className="column">
              {resultsElem}
            </Col>
            <Col className="column">
              <div>
                <h2>Saved Recipes</h2>
                <RecipeList
                  recipes={this.state.savedRecipes}
                  onSecondaryCTAClick={this.deleteRecipe}
                  secondaryCTAText="Delete Recipe"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;