use std::{
    collections::HashMap,
    fs::File,
    process::{Command, Stdio},
};

use maplit::hashmap;
use serde::{Deserialize, Serialize};
use structopt::StructOpt;

#[derive(StructOpt)]
#[structopt(about = "the stupid content tracker")]
enum Opt {
    CreateStats,
    EntryPoint,
}
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
    #[serde(rename = "type")]
    value_type: String,
    value: String,
    description: String,
    copyable: bool,
    qr: bool,
    masked: bool,
}
fn main() {
    let opt = Opt::from_args();

    match opt {
        Opt::CreateStats => create_stats(),
        Opt::EntryPoint => entry_point(),
    }
}

fn create_stats() {
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
                value_type: "string".to_string(),
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

fn entry_point() {}
