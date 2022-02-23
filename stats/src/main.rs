use std::{
    collections::HashMap,
    fs::File,
    process::{Command, Stdio},
};

use maplit::hashmap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
struct SyncthingSystem {
    #[serde(rename = "myID")]
    my_id: String,
}

#[derive(Debug, Serialize)]
struct Stats {
    data: HashMap<String, StatsData>,
    version: u64,
}
#[derive(Debug, Serialize)]
struct StatsData {
    r#type: String,
    name: String,
    value: String,
    description: String,
    copyable: bool,
    qr: bool,
    masked: bool,
}
fn main() {
    let child = Command::new("syncthing")
        .args(&["cli", "show", "system"])
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();

    let syncthing_system: SyncthingSystem = serde_json::from_reader(child.stdout.unwrap()).unwrap();

    let stats = Stats {
        version: 2,
        data: hashmap! {
            "id".to_string() => StatsData{
                r#type: "string".to_string(),
                name: "id".to_string(),
                value: syncthing_system.my_id,
                description: "his is the ID for syncthing to attach others to".to_string(),
                copyable: true,
                qr: true,
                masked: false,
            },
        },
    };

    let file = File::create("/root/start9/stats.yaml").unwrap();
    serde_yaml::to_writer(file, &stats).unwrap();
}
