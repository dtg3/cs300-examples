using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnController : MonoBehaviour
{
    // Start is called before the first frame update
    [SerializeField] private GameObject enemy;
    [SerializeField] private float spawnTime = 0.4f;
    [SerializeField] private float spawnDelay = 0.1f;
    void Start()
    {
        InvokeRepeating("Spawn", spawnTime, spawnDelay);
    }

    private void Spawn()
    {
        Vector3 spawnPos = transform.position;
        spawnPos.y += 2.0f;
        Instantiate(enemy, spawnPos, Quaternion.identity);
    }
}
