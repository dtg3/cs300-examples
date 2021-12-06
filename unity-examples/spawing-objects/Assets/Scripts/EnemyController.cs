using UnityEngine;

public class EnemyController : MonoBehaviour
{
    private GameObject player;
    private CharacterController controller;
    [SerializeField] private float speed = 4.0f;
    // Start is called before the first frame update
    void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player");
        controller = GetComponent<CharacterController>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
