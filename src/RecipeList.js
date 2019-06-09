import React from 'react';
import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard.js';
import CardDeck from 'react-bootstrap/CardDeck';

export default class recipeList extends React.Component {

  static propTypes = {
    recipes: PropTypes.array,
    onSecondaryCTAClick: PropTypes.func,
    secondaryCTAText: PropTypes.string
  }

  render() {
    const recipeList = this.props.recipes
      .map((item, idx) => {
        return (
          <RecipeCard
            name={item.recipe.label}
            url={item.recipe.url}
            imageUrl={item.recipe.image}
            onSecondaryCTAClick={this.props.onSecondaryCTAClick}
            secondaryCTAText={this.props.secondaryCTAText}
            idx={idx}
            key={idx}
          />
        );
      });

    return (
      <div>
        <CardDeck>
          {recipeList}
        </CardDeck>
      </div>
    );
  }
}