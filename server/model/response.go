package model

type ResponseCode int

const (
	Err ResponseCode = iota
	Success
	NeedLogin
)

type Response struct {
	Code ResponseCode `json:"code"`
	Msg  string       `json:"msg"`
	Data interface{}  `json:"data"`
}
