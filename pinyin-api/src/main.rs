use std::env;
use std::error::Error;

use actix_web::web::{self, Json, Query};
use actix_web::{get, App, HttpServer};
use pinyin::ToPinyinMulti;

#[derive(serde::Deserialize)]
pub struct Pinyin {
    pub value: String,
}

type Response = Vec<Vec<&'static str>>;

#[get("/api.rs")]
async fn api(Query(Pinyin { value }): Query<Pinyin>) -> Json<Response> {
    let response: Response = (&*value)
        .to_pinyin_multi()
        .map(|p| {
            p.map_or_else(Vec::new, |multi| {
                multi.into_iter().map(|p| p.with_tone()).collect()
            })
        })
        .collect();
    Json(response)
}

async fn default() -> &'static str {
    "API usage: https://pinyin-api.toolforge.org/api.rs?value=YOUR_VALUE_HERE"
}

#[actix_web::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    let port = env::var("PORT")
        .as_deref()
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8000);
    HttpServer::new(|| App::new().service(api).default_service(web::to(default)))
        .bind(("0.0.0.0", port))?
        .run()
        .await?;
    Ok(())
}
