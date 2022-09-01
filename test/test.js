const supertest = require('supertest')
const chai = require('chai')
const app = require('../dist/app')

const expect = chai.expect
let jwttoekn = ''
let userName
let userId
const request = supertest(app.listen())
jest.setTimeout(30000)
describe('api demo test', () => {
  it('begin helloworld test', (done) => {
    request
      .get('/helloworld')
      .expect(200)
      .end((err, res) => {
        let response = res.body
        expect(response.code).to.be.equal(0, 'helloworld success')
        done()
      })
  })
  it('begin user add', (done) => {
    userName = 'nameterst' + new Date().getTime()
    request
      .post('/adduser')
      .send({
        address: 'addresstest' + new Date().getTime(),
        name: userName,
        description: 'descriptiontest' + new Date().getTime(),
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        let response = res.body
        //expect(response.code).to.be.equal(500, 'adduser error')
        expect(response.code).to.be.equal(0, 'adduser success')
        jwttoekn = response.data.token
        userId = response.data.id
        done()
      })
  })
  it('begin user get', (done) => {
    request
      .get('/userByName/' + userName)
      .set({ Authorization: `Bearer ${jwttoekn}` })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        let response = res.body

        expect(response.code).to.be.equal(0, 'userByName success')

        done()
      })
  })
  it('begin user update', (done) => {
    request
      .put('/user/' + userName)
      .set({ Authorization: `Bearer ${jwttoekn}` })
      .send({
        address: 'addresstest' + new Date().getTime(),

        description: 'descriptiontest' + new Date().getTime(),
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        let response = res.body

        expect(response.code).to.be.equal(0, 'update success')

        done()
      })
  })
  it('begin user delete', (done) => {
    request
      .delete('/user/' + userId)
      .set({ Authorization: `Bearer ${jwttoekn}` })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        let response = res.body

        expect(response.code).to.be.equal(0, 'delete success')

        done()
      })
  })
})
