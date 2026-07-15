'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
import Swal from "sweetalert2";
import './style.css';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { setCookie, getCookie } from 'cookies-next';
import { login } from '@/services/auth';


export default function Auth() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const validateMessages = {
        required: '${label} is required!',
    };

    const handleLogin = async (values: any) => {
        setLoading(true);

        try {
            // Make request to API login endpoint with form data
            const response: any = await login({ email: values.email, password: values.password });
            if (response) {
                const data = response;

                // Assuming token is in response
                const token = data.access_token;
                const profile = data.profile;

                // Save token in  cookie
                // setCookie('token', token, {
                //     path: '/',
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === 'production',
                // })
                setCookie('token', token)
                setCookie('profile', profile)

                // Redirect to index page
                if (profile.redirect_to) {
                    router.push(profile.redirect_to);
                } else {
                    router.push('/dashboard');
                }
            } else {
                throw new Error('Login failed');
            }
        } catch (error: any) {
            if (error?.response?.status) {
                if (error?.response?.status === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "Authentication Failed",
                        text: "Incorrect user account or password. Please check your credentials and try again.",
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else if (error?.response?.status === 403) {
                    Swal.fire({
                        icon: "error",
                        title: "Authentication Failed",
                        text: "Account is deactivated. Please contact support for assistance.",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            }
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }
    };

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            router.push('/dashboard');
        }
    }, []);

    return <Row gutter={[0, 0]}>
        <Col xs={0} sm={12} md={12} lg={16} xl={18}>
            <Image src={'/../images/banner4.jpeg'} alt="Background Image" layout='fill' />
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={6} style={{ minHeight: '100vh', position: 'relative', borderTop: '5px solid #0060a9' }}>
            <Form
                validateMessages={validateMessages}
                layout="vertical"
                className="login-container"
                onFinish={handleLogin}
            >
                <div style={{ textAlign: 'center' }}>
                    <img className="logo" src="/images/logo.png" alt="logo-auth" style={{ width: 100 }} />
                    <h3 style={{ color: '#76838f' }}>ASEAN Risk Management System</h3>
                </div>
                <Form.Item
                    name={"email"}
                    label="Email Address"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        className="input"
                    />

                </Form.Item>

                <Form.Item
                    name={"password"}
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        type="password"
                        placeholder="Enter password"
                        className="input" />

                </Form.Item>

                <Button disabled={loading} loading={loading} type="primary" htmlType="submit" style={{ marginTop: 30 }}>
                    Login
                </Button>
            </Form>
        </Col>
    </Row>
};


