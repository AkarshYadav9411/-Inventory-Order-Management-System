from fastapi.testclient import TestClient


def test_customer_crud(client: TestClient) -> None:
    payload = {"full_name": "Ada Lovelace", "email": "ada@example.com", "phone": "+1 555 0100"}
    created = client.post("/api/v1/customers", json=payload)
    assert created.status_code == 201
    customer = created.json()["data"]

    duplicate = client.post("/api/v1/customers", json=payload)
    assert duplicate.status_code == 409

    listed = client.get("/api/v1/customers")
    assert listed.status_code == 200
    assert len(listed.json()["data"]) == 1

    fetched = client.get(f"/api/v1/customers/{customer['id']}")
    assert fetched.status_code == 200
    assert fetched.json()["data"]["email"] == "ada@example.com"

    deleted = client.delete(f"/api/v1/customers/{customer['id']}")
    assert deleted.status_code == 204


def test_customer_validation_rejects_bad_email_and_phone(client: TestClient) -> None:
    response = client.post(
        "/api/v1/customers",
        json={"full_name": "Bad Contact", "email": "not-email", "phone": "abc"},
    )
    assert response.status_code == 422
