import _ from "lodash";
import axios from "axios";
import React, { Component } from "react";
import { Route, Redirect } from 'react-router'
import ReactDOM from 'react-dom'
import AnyChart from 'anychart-react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchIndicadores } from "../actions";

class PostsIndex extends Component {
  componentDidMount() {
    this.props.fetchIndicadores();
  }

  renderIndicadores() {
    return _.map(this.props.indicadores.topUsers, users => {
      complexSettings.data = complexSettings.data + "@" +users.apelido+","+users.quantidadeSeguidores+"\n";
      return (
        <li className="list-group-item" key={users.id}>
            <b>@{users.apelido}</b> - {users.quantidadeSeguidores} Seguidores
        </li>
      );
    });
  }

  renderIndicadoresGrafico() {
    return _.map(this.props.indicadores.topUsers, users => {
      complexSettings.data = complexSettings.data + "@" +users.apelido+","+users.quantidadeSeguidores+"\n";
    });
  }

  renderIndicadoresHorasDia() {
    return _.map(this.props.indicadores.resumoTweetsPorHora, indicador => {
      complexSettingsHorasDia.data = complexSettingsHorasDia.data + indicador.hora+","+indicador.total+"\n";
      return (
        <li className="list-group-item">
            <b>{indicador.hora}h</b> - {indicador.total} tweets
        </li>
      );
    });
  }

  renderIndicadoresHorasDiaGrafico() {
    return _.map(this.props.indicadores.resumoTweetsPorHora, indicador => {
      complexSettingsHorasDia.data = complexSettingsHorasDia.data + indicador.hora+","+indicador.total+"\n";
    });
  }

  renderHashtagsIdioma() {
    return _.map(this.props.indicadores.hashTagsPorPais, indicador => {
      return (
        <li className="list-group-item">
            <b>#{indicador.hashTag}</b>  Pais: {indicador.pais} - Total: {indicador.total} tweets
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        <br />
        <div className="text-xs-left">
          <img src="/style/logo-itau-fb.png" width="80px" height="80px"></img>
        </div>
        <div className="text-xs-center">
          <h2>Case de integração com o Twitter</h2>
        </div>
        <div className="text-xs-right">
          <button className="btn btn-primary" onClick={atualizarDados}>Atualizar Dados</button>
        </div>

        {this.renderIndicadoresGrafico()}
        {this.renderIndicadoresHorasDiaGrafico()}
        <AnyChart {...complexSettings} />
        <AnyChart {...complexSettingsHorasDia} />

        <h3>Top 5 usuários</h3>
        <ul className="list-group">
          {this.renderIndicadores()}
        </ul>
        <br />
        <br />
        <h3>Postagens por hora do dia</h3>
        <ul className="list-group">
          {this.renderIndicadoresHorasDia()}
        </ul>
        <br />
        <br />
        <h3>Hahstags por idioma</h3>
        <ul className="list-group">
          {this.renderHashtagsIdioma()}
        </ul>
        <br />
        <br />

      </div>
      
    );
  }
}

const complexSettings = {
  width: 1100,
  height: 300,
  type: 'column',
  data: "",
  title: 'Top 5 usuários',
  yAxis: [1, {
    orientation: 'right',
    enabled: true,
    labels: {
      format: '{%Value}{decimalPoint:\\,}',
      fontColor: 'red'
    }
  }],
  legend: {
    background: 'lightgreen 0.4',
    padding: 0
  },
  lineMarker: {
    value: 4.5
  }
};

const complexSettingsHorasDia = {
  width: 1100,
  height: 300,
  type: 'column',
  data: "",
  title: 'Posts por hora do dia',
  yAxis: [1, {
    orientation: 'right',
    enabled: true,
    labels: {
      format: '{%Value}{decimalPoint:\\,}',
      fontColor: 'red'
    }
  }],
  legend: {
    background: 'lightgreen 0.4',
    padding: 0
  },
  lineMarker: {
    value: 0
  }
};

function atualizarDados() {
  var request = {
    "hashtags" : [
      "openbanking",
      "apifirst",
      "devops",
      "cloudfirst",
      "microservices",
      "apigateway",
      "oauth",
      "swagger",
      "raml",
      "openapis"
    ]
  }
  axios
  .post(`http://twitter-service:8090/v1/tweets/processarTweets`, request)
  .then(() => refresh());
}

function refresh() {
  <Redirect to="/"/>
}

function mapStateToProps(state) {
  return { indicadores: state.posts };
}

export default connect(mapStateToProps, { fetchIndicadores })(PostsIndex);
