const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello to JWT Auth!')
})

const users = [
    {
        id: '1',
        username: 'john',
        password: 'john123',
        isAdmin: true,
    },
    {
        id: '2',
        username: 'jane',
        password: 'jane123',
        isAdmin: false,
    },
]

let refreshTokens = []

app.post('/api/refresh', (req, res) => {
    //take refresh token from user
    const refreshToken = req.body.token
    //send error if token is invalid
    if (!refreshToken) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403)
    }
    jwt.verify(refreshToken, 'myRefreshSecretKey', (err, user) => {
        err && console.log(err)

        refreshTokens = refreshTokens.filter((token) => token !== refreshToken)

        const newAccesssToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        refreshTokens.push(newRefreshToken)

        res.status(200).json({
            accessToken: newAccesssToken,
            refreshToken: newRefreshToken,
        })
    })
    //if everything is ok, create new access token, refresh token and send to user
})

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'mySecretKey', {
        expiresIn: '1m',
    })
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        'myRefreshSecretKey'
    )
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    // console.log(username)
    const user = users.find((u) => {
        return u.username === username && u.password === password
    })
    if (user) {
        //Generate an access token
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        refreshTokens.push(refreshToken)
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken,
        })
    } else {
        res.sendStatus(400)
    }
})

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, 'mySecretKey', (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }

            req.user = user
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

app.delete('/api/users/:userId', verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.sendStatus(200)
    } else {
        res.sendStatus(403)
    }
})

app.post('/api/logout', verify, (req, res) => {
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.sendStatus(200)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('Backend Server is running!'))
