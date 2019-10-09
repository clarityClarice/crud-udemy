import React, { Component } from 'react'
import Main from '../template/Main'
import Axios from 'axios'

const headerProps = {
    icon: 'user',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Inlcuir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3001/users'
const initialState = {
    user: {name: '', email: ''},
    list: []
}

export default class UserCrud extends Component {
    state = { ...initialState}

    componentWillMount(){
        Axios(baseUrl).then(resp => {
            this.setState({ list: resp.data})
        })
    }

    clear() {
        this.setState({user: initialState.user})
    }

    save(){
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        Axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list})
            })
    }

    getUpdatedList(user){
        const list = this.state.list.filter(u => u.id !== user.id)
        list.unshift(user)
        return list
    }

    updateField(event){
        const user = {...this.state.user}
        user[event.target.name] = event.target.value 
        this.setState({ user })

    }

    renderForm(){
        return (
            <div className='form'>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label> Nome </label>
                            <input type="text"
                                name="name"
                                className="form-control"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome do usuário"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group" >
                            <label> E-mail </label>
                            <input type="text"
                                name="email"
                                className="form-control"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o E-mail" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-12 d-flex justify-content-end'>
                        <button className="btn btn-primary" onClick={ e => this.save(e)}>
                            Salvar
                        </button>

                        <button onClick={ e => this.clear(e)} className="btn btn secondary ml-2">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        Axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.state.list.filter( u=> u!==user)
            this.setState({ list })
        })
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map( user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>

                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render () {
        
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}