from fastapi.testclient import TestClient


def test_product_crud(client: TestClient) -> None:
    payload = {"name": "Laptop", "sku": "SKU-1001", "price": "1200.00", "quantity_in_stock": 15}
    created = client.post("/api/v1/products", json=payload)
    assert created.status_code == 201
    product = created.json()["data"]
    assert product["sku"] == "SKU-1001"

    duplicate = client.post("/api/v1/products", json=payload)
    assert duplicate.status_code == 409

    listed = client.get("/api/v1/products?search=laptop")
    assert listed.status_code == 200
    assert len(listed.json()["data"]) == 1

    updated = client.put(f"/api/v1/products/{product['id']}", json={"quantity_in_stock": 20})
    assert updated.status_code == 200
    assert updated.json()["data"]["quantity_in_stock"] == 20

    deleted = client.delete(f"/api/v1/products/{product['id']}")
    assert deleted.status_code == 204
    missing = client.get(f"/api/v1/products/{product['id']}")
    assert missing.status_code == 404


def test_product_validation_rejects_invalid_values(client: TestClient) -> None:
    response = client.post(
        "/api/v1/products",
        json={"name": "Bad", "sku": "BAD", "price": "0.00", "quantity_in_stock": -1},
    )
    assert response.status_code == 422
