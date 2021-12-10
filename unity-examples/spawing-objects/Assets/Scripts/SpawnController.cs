using System.Collections;
using UnityEngine;

public class SpawnController : MonoBehaviour
{
    // Start is called before the first frame update
    [SerializeField] private GameObject enemy;
    [SerializeField] private GameObject player;
    [SerializeField] private float spawnTime = 0.4f;
    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player");
        StartCoroutine(SpawnRoutine());
    }

    IEnumerator SpawnRoutine()
    {
        while (player.activeInHierarchy)
        {
            yield return new WaitForSeconds(spawnTime);
            Vector3 spawnPos = transform.position;
            spawnPos.y += 2f;
            Instantiate(enemy, spawnPos, Quaternion.identity);
        }
    }
}
