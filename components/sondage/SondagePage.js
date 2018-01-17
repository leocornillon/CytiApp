import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import { DropDownMenu, View, Divider } from '@shoutem/ui';

import Filter from './components/Filter';
import SondageList from './components/SondageList';

import {updateFilter} from '../../actions';

class SondagePage extends Component {

  constructor(props){
    super(props);
    this.state = {
      filters: [
        { title: 'All', value: 'All' },
        { title: 'Beauté', value: 'beauty' },
        { title: 'Sport ', value: 'sport' },
        { title: 'Shopping', value: 'shopping' },
        { title: 'Mode', value: 'fashion' },
      ]
    }
    this.setNewFilter = this.setNewFilter.bind(this);
  }

  setNewFilter(filter){
    this.setState({selectedFilter : filter});
    this.props.dispatch(updateFilter(filter.value));
  }

  render() {
    
    return (
        <View style={{flex : 1}}>
            <DropDownMenu
              styleName="horizontal"
              options={this.state.filters}
              selectedOption={this.state.selectedFilter ? this.state.selectedFilter : this.state.filters[0]}
              onOptionSelected={(filter) => {this.setNewFilter(filter)}}
              titleProperty="title"
              valueProperty="value"
              style={{marginBottom:5}}
            />
            <Divider styleName="line"/>
            <SondageList />
        </View>
    );
  }
}

export default connect()(SondagePage);