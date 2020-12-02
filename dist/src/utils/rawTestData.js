"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valid_user_jwt = exports.valid_admin_jwt = exports.invalid_jwt = exports.base_url = void 0;
const base_url = '/api/v1';
exports.base_url = base_url;
const invalid_jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWZiNjdmNmIzNDNhMjhhNDM2ZTUwMiIsImlhdCI6MTYwNTcwMjc0OCwiZXhwIjoxNjA1Nzg5MTQ4fQ.RDAxRrveU0a3m1eMq_3Ro-Qif5-Ph7iavACtciJEpVM';
exports.invalid_jwt = invalid_jwt;
const valid_admin_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYzY5OTUxM2QwMDA5MGY4NDA2MjkyNSIsImlhdCI6MTYwNjg1MDg5OCwiZXhwIjoxNjA2OTM3Mjk4fQ.gjdTbHLxfw7XLQhOYnpZVcHRiQJnyvj7-M8yj8l2tFc";
exports.valid_admin_jwt = valid_admin_jwt;
const valid_user_jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYzY5OTI3M2QwMDA5MGY4NDA2MjkyNCIsImlhdCI6MTYwNjg1MDg1NiwiZXhwIjoxNjA2OTM3MjU2fQ.7cTh0uKSqkE8noMhhEQfXdmswWvyBQAr17sC0X-ebRU';
exports.valid_user_jwt = valid_user_jwt;