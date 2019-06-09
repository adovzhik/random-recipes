import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
      returnedRecipes: [],
      savedRecipes: [],
      resultsText: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

 componentDidMount() {
  this.updateStateFromLocalStorage();

  // update recipes in localStorage when user leaves/refreshes the page
  window.addEventListener(
    "beforeunload",
    this.updateRecipeInLocalStorage.bind(this)
  );
}

componentWillUnmount() {
  window.removeEventListener(
    "beforeunload",
    this.updateRecipeInLocalStorage.bind(this)
  );

  // saves if component has a chance to unmount
  this.updateRecipeInLocalStorage();
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

  updateRecipeInLocalStorage() {
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

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ingredient: this.ingredInput.value});
  }

  componentDidUpdate(prevProps, prevState) {
    // only fetch if a new ingredient was entered
    if (this.state.ingredient !== prevState.ingredient) {
      this.fetchData();
    }
  }
  fetchData() {
    // API REQUEST
    const food = this.state.ingredient;
    // optional parameters
    // food restrictions
    const healthParam = "";
    // find 10 random results
    const start = Math.floor(Math.random() * 80);
    const end = start + 10;
    const rangeParam = `&from=${start}&to=${end}`;
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
        console.log(recipes);
        this.setState({
          returnedRecipes: recipes,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          hasError: true,
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
        <form onSubmit={this.handleSubmit}>
          <label>
            Ingredient(s):
          <input type="text" ref={el => this.ingredInput = el} />
          </label>
          <input type="submit" value="Find Recipes" />
        </form>
        <Container>
          <Row>
            <Col>
              {resultsElem}
            </Col>
            <Col>
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